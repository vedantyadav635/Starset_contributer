import { Router, Request, Response } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /admin/export/:taskId
 * Export all approved submissions for a task in the specified metadata format.
 * Falls back to pending_validation if no approved submissions exist.
 */
router.get("/:taskId", async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        // 1. Fetch task details
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();

        if (taskError || !task) {
            console.error('❌ Export: Task not found', taskError);
            return res.status(404).json({ error: "Task not found", details: taskError?.message });
        }

        // 2. Fetch submissions (without profile join to avoid relationship errors)
        //    Try approved first, fall back to all statuses
        let { data: submissions, error: subError } = await supabase
            .from('submissions')
            .select('*')
            .eq('task_id', taskId)
            .eq('status', 'approved');

        if (subError) {
            console.error('❌ Export: Error fetching approved submissions:', subError);
            return res.status(500).json({
                error: "Failed to fetch submissions for export",
                details: subError.message
            });
        }

        // If no approved submissions, fetch all submissions for this task
        if (!submissions || submissions.length === 0) {
            const { data: allSubs, error: allSubError } = await supabase
                .from('submissions')
                .select('*')
                .eq('task_id', taskId)
                .in('status', ['pending_validation', 'approved']);

            if (allSubError) {
                console.error('❌ Export: Error fetching all submissions:', allSubError);
                return res.status(500).json({
                    error: "Failed to fetch submissions for export",
                    details: allSubError.message
                });
            }

            submissions = allSubs;
        }

        if (!submissions || submissions.length === 0) {
            // Return an empty export file instead of an error
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=task_${taskId}_metadata.json`);
            return res.status(200).send(JSON.stringify([], null, 2));
        }

        // 3. Fetch profiles separately for all unique user IDs
        const userIds = [...new Set(submissions.map((s: any) => s.user_id))];
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, gender, age, city, state')
            .in('id', userIds);

        // Build a lookup map: userId → profile
        const profileMap: Record<string, any> = {};
        (profiles || []).forEach((p: any) => { profileMap[p.id] = p; });

        // 4. Map to export format
        const exportData = submissions.map((sub: any, index: number) => {
            const tech = sub.technical_metadata || {};
            const profile = profileMap[sub.user_id] || {};

            // Extract filename from URL
            const fileUrl = sub.audio_url || sub.image_url || '';
            const speechFile = fileUrl ? fileUrl.split('/').pop() : 'unknown';

            return {
                sl_no: index + 1,
                speechFile: speechFile,
                transcription: task.prompt || "",
                callDuration: sub.duration_seconds || 0,
                speechMode: "Read",
                topic: task.project || "General",
                status: sub.status,
                speakerUniqueId: profile.id || sub.user_id || "unknown",
                recordingDetails: {
                    channel: tech.channels === 1 ? "Mono" : "Stereo",
                    samplingFrequencyHz: tech.sampleRate || 16000,
                    bitsPerSample: tech.bitsPerSample || 16
                },
                languageDetails: {
                    dominantScript: task.language?.toLowerCase() || "unknown"
                },
                audioFormat: {
                    encoding: tech.encoding || "PCM",
                    bitwidth: tech.bitsPerSample || 16,
                    samplingFrequency: `${(tech.sampleRate || 16000) / 1000} KHz`
                },
                speakerInfo: {
                    name: profile.full_name || "unknown",
                    gender: profile.gender === "Male" ? "M" : profile.gender === "Female" ? "F" : "O",
                    age: profile.age || null,
                    city: profile.city || null,
                    state: profile.state || null
                }
            };
        });

        // 5. Send as downloadable JSON
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=task_${taskId}_metadata.json`);

        return res.status(200).send(JSON.stringify(exportData, null, 2));

    } catch (error: any) {
        console.error('🔥 Export crash:', error);
        return res.status(500).json({
            error: "Internal server error during export",
            details: error?.message
        });
    }
});

export default router;
