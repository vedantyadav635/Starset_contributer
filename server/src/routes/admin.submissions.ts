import { Router, Request, Response } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /admin/submissions
 * List all submissions with optional filters
 * Query params: status, task_id, limit (default 50)
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { status, task_id, limit = 50 } = req.query;

        let query = supabase
            .from('submissions')
            .select(`
                id,
                task_id,
                user_id,
                audio_url,
                image_url,
                text_content,
                selected_option,
                file_size,
                mime_type,
                duration_seconds,
                status,
                validation_status,
                validation_errors,
                validated_at,
                reviewed_by,
                reviewed_at,
                rejection_reason,
                submitted_at,
                tasks:task_id ( title, type, prompt, compensation ),
                profiles:user_id ( full_name, email_text )
            `)
            .order('submitted_at', { ascending: false })
            .limit(Number(limit));

        if (status) query = query.eq('status', status as string);
        if (task_id) query = query.eq('task_id', task_id as string);

        const { data, error } = await query;

        if (error) {
            console.error('❌ DB error fetching submissions:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, submissions: data || [] });

    } catch (err: any) {
        console.error('❌ Server error:', err);
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /admin/submissions/pending
 * Shortcut: submissions ready for human review
 */
router.get("/pending", async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('submissions')
            .select(`
                id,
                task_id,
                user_id,
                audio_url,
                image_url,
                text_content,
                selected_option,
                file_size,
                mime_type,
                duration_seconds,
                status,
                validation_status,
                validation_errors,
                submitted_at,
                tasks:task_id ( title, type, prompt, compensation ),
                profiles:user_id ( full_name, email_text )
            `)
            .eq('status', 'pending_validation')
            .order('submitted_at', { ascending: true })
            .limit(100);

        if (error) {
            console.error('❌ DB error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, submissions: data || [] });

    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /admin/submissions/:id/approve
 * Approve a submission:
 * 1. Copy file from final → processed bucket (server-side)
 * 2. Update DB: status=approved, processed_audio_url, storage_stage=processed
 */
router.patch("/:id/approve", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adminId } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Submission ID required" });
        }

        // Fetch submission to get final_file_id
        const { data: submission, error: fetchError } = await supabase
            .from('submissions')
            .select('id, final_file_id, audio_url, mime_type, task_id, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !submission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        let processedAudioUrl: string | null = null;

        // Copy to processed bucket if this is an audio submission with a final file
        if (submission.final_file_id) {
            try {
                const { copyBetweenBuckets } = await import('../utils/b2Upload');
                // Generate processed filename (same path, different bucket)
                const timestamp = Date.now();
                const processedFileName = `audio/${submission.user_id}/${submission.task_id}_processed_${timestamp}.webm`;
                const processedResult = await copyBetweenBuckets(
                    submission.final_file_id,
                    processedFileName,
                    'processed'
                );
                processedAudioUrl = processedResult.url;
                console.log(`📦 Copied to PROCESSED bucket: ${processedAudioUrl}`);
            } catch (copyErr: any) {
                console.error('⚠️ Failed to copy to processed bucket:', copyErr?.message);
                // Non-fatal — still approve even if copy fails
            }
        }

        const { data, error } = await supabase
            .from('submissions')
            .update({
                status: 'approved',
                validation_status: 'approved',
                storage_stage: processedAudioUrl ? 'processed' : 'final',
                processed_audio_url: processedAudioUrl,
                reviewed_by: adminId || 'admin',
                reviewed_at: new Date().toISOString(),
                rejection_reason: null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('❌ DB error approving submission:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`✅ Submission ${id} approved by ${adminId || 'admin'}`);
        return res.status(200).json({ success: true, submission: data });

    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /admin/submissions/:id/reject
 * Reject a submission with a reason
 */
router.patch("/:id/reject", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adminId, reason } = req.body;

        if (!id || !reason) {
            return res.status(400).json({ error: "Submission ID and rejection reason are required" });
        }

        const { data, error } = await supabase
            .from('submissions')
            .update({
                status: 'rejected',
                validation_status: 'rejected',
                reviewed_by: adminId || 'admin',
                reviewed_at: new Date().toISOString(),
                rejection_reason: reason,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('❌ DB error rejecting submission:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`🚫 Submission ${id} rejected: ${reason}`);
        return res.status(200).json({ success: true, submission: data });

    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
