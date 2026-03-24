import { Router, Request, Response } from "express";
import { supabase } from "../db/supabase";

const router = Router();

/**
 * GET /admin/export/:taskId
 * Export all approved submissions for a task in the specified metadata format
 */
router.get("/:taskId", async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        // Fetch task details for transcription and topic
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();

        if (taskError || !task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Fetch all approved submissions with profile data
        const { data: submissions, error: subError } = await supabase
            .from('submissions')
            .select(`
                id,
                audio_url,
                duration_seconds,
                technical_metadata,
                submitted_at,
                profiles:user_id (
                    id,
                    full_name,
                    gender,
                    age,
                    city,
                    state
                )
            `)
            .eq('task_id', taskId)
            .eq('status', 'approved');

        if (subError) {
            console.error('❌ Export error:', subError);
            return res.status(500).json({ error: "Failed to fetch submissions for export" });
        }

        // Map to requested format
        const exportData = (submissions || []).map((sub: any, index: number) => {
            const tech = sub.technical_metadata || {};
            const profile = sub.profiles || {};

            // Extract filename from URL
            const speechFile = sub.audio_url ? sub.audio_url.split('/').pop() : 'unknown.wav';

            return {
                sl_no: index + 1,
                speechFile: speechFile,
                transcription: task.prompt || "",
                callDuration: sub.duration_seconds || 0,
                speechMode: "Read", // Default as seen in example
                topic: task.project || "General",
                speakerUniqueId: profile.id || "unknown",
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
                    gender: profile.gender === "Male" ? "M" : profile.gender === "Female" ? "F" : "O"
                }
            };
        });

        // Set headers for JSON file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=task_${taskId}_metadata.json`);

        return res.status(200).send(JSON.stringify(exportData, null, 2));

    } catch (error: any) {
        console.error('🔥 Export crash:', error);
        return res.status(500).json({ error: "Internal server error during export" });
    }
});

export default router;
