import { Router, Request, Response } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /user/submissions/:userId
 * Get all submissions for a specific user
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                error: "User ID is required"
            });
        }

        // Fetch all submissions for this user
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('task_id, status, submitted_at')
            .eq('user_id', userId);

        if (error) {
            console.error('❌ Database error:', error);
            return res.status(500).json({
                error: "Failed to fetch user submissions",
                details: error.message
            });
        }

        // Return array of completed task IDs
        const completedTaskIds = submissions?.map(sub => sub.task_id) || [];

        return res.status(200).json({
            success: true,
            completedTasks: completedTaskIds,
            submissions: submissions || []
        });

    } catch (error: any) {
        console.error('❌ Error fetching user submissions:', error);
        return res.status(500).json({
            error: "Failed to fetch user submissions",
            details: error.message
        });
    }
});

/**
 * GET /user/submissions/:userId/task/:taskId
 * Check if user has completed a specific task
 */
router.get("/:userId/task/:taskId", async (req: Request, res: Response) => {
    try {
        const { userId, taskId } = req.params;

        if (!userId || !taskId) {
            return res.status(400).json({
                error: "User ID and Task ID are required"
            });
        }

        // Check if submission exists
        const { data: submission, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('user_id', userId)
            .eq('task_id', taskId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('❌ Database error:', error);
            return res.status(500).json({
                error: "Failed to check task completion",
                details: error.message
            });
        }

        return res.status(200).json({
            success: true,
            completed: !!submission,
            submission: submission || null
        });

    } catch (error: any) {
        console.error('❌ Error checking task completion:', error);
        return res.status(500).json({
            error: "Failed to check task completion",
            details: error.message
        });
    }
});

export default router;
