import { Router, Request, Response } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /admin/stats
 * Returns real-time dashboard statistics:
 * - totalUsers: count of all profiles
 * - activeTasks: count of tasks with status 'active'
 * - totalSubmissions: count of all submissions
 * - deletedTasks: count of tasks with status 'deleted' or 'discarded'
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        // 1. Total users (profiles)
        const { count: totalUsers, error: usersError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

        if (usersError) {
            console.error("❌ Error counting users:", usersError);
        }

        // 2. Active tasks (status = 'AVAILABLE' or 'In Progress')
        const { count: activeTasks, error: tasksError } = await supabase
            .from("tasks")
            .select("*", { count: "exact", head: true })
            .in("status", ["AVAILABLE", "Available", "active", "In Progress"]);

        if (tasksError) {
            console.error("❌ Error counting active tasks:", tasksError);
        }

        // 3. Total submissions
        const { count: totalSubmissions, error: subsError } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true });

        if (subsError) {
            console.error("❌ Error counting submissions:", subsError);
        }

        // 4. Deleted/discarded tasks (flagged items)
        const { count: deletedTasks, error: deletedError } = await supabase
            .from("tasks")
            .select("*", { count: "exact", head: true })
            .in("status", ["deleted", "discarded", "flagged", "Not Accepted"]);

        if (deletedError) {
            console.error("❌ Error counting deleted tasks:", deletedError);
        }

        const stats = {
            totalUsers: totalUsers || 0,
            activeTasks: activeTasks || 0,
            totalSubmissions: totalSubmissions || 0,
            deletedTasks: deletedTasks || 0,
        };

        console.log("📊 Admin stats:", stats);
        res.status(200).json(stats);

    } catch (error: any) {
        console.error("🔥 Error fetching admin stats:", error);
        res.status(500).json({
            error: "Failed to fetch stats",
            details: error.message,
        });
    }
});

export default router;
