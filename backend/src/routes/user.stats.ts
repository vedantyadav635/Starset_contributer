import { Router, Request, Response } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /user/stats/:userId
 * Returns per-user dashboard statistics:
 * - totalSubmissions: total tasks submitted by this user
 * - inValidation: submissions with status 'pending_validation'
 * - accepted: submissions with status 'accepted' or 'validated'
 * - acceptanceRate: percentage of accepted vs total
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // 1. Total submissions by this user
        const { count: totalSubmissions, error: totalError } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

        if (totalError) {
            console.error("❌ Error counting submissions:", totalError);
        }

        // 2. Submissions in validation queue
        const { count: inValidation, error: valError } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("status", "pending_validation");

        if (valError) {
            console.error("❌ Error counting validation queue:", valError);
        }

        // 3. Accepted/validated submissions
        const { count: accepted, error: accError } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .in("status", ["accepted", "validated", "approved"]);

        if (accError) {
            console.error("❌ Error counting accepted:", accError);
        }

        const total = totalSubmissions || 0;
        const acc = accepted || 0;
        const acceptanceRate = total > 0 ? ((acc / total) * 100).toFixed(1) : "0.0";

        const stats = {
            totalSubmissions: total,
            inValidation: inValidation || 0,
            accepted: acc,
            acceptanceRate: `${acceptanceRate}%`,
        };

        console.log(`📊 User ${userId} stats:`, stats);
        res.status(200).json(stats);

    } catch (error: any) {
        console.error("🔥 Error fetching user stats:", error);
        res.status(500).json({
            error: "Failed to fetch user stats",
            details: error.message,
        });
    }
});

export default router;
