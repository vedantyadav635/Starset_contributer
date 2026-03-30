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

        // 4. Map to export format (Async to allow on-the-fly duration calculation for old records)
        const exportData = await Promise.all(submissions.map(async (sub: any, index: number) => {
            const tech = sub.technical_metadata || {};
            const profile = profileMap[sub.user_id] || {};
            const fileUrl = sub.audio_url || sub.image_url || '';
            const speechFile = fileUrl ? fileUrl.split('/').pop() : 'unknown';

            // ── DURATION CALCULATION ──
            // 1. Try DB field (duration_seconds)
            // 2. Try technical_metadata backup
            // 3. IF STILL 0/NULL: Fetch file and calculate on-the-fly (Fixes old recordings)
            let rawDuration = (sub.duration_seconds && sub.duration_seconds > 0)
                ? sub.duration_seconds
                : (tech.durationSeconds || 0);

            if (!rawDuration && fileUrl && fileUrl.includes('.webm')) {
                try {
                    const mm = await import('music-metadata');
                    const response = await fetch(fileUrl);
                    if (response.ok) {
                        const buffer = await response.arrayBuffer();
                        const metadata = await mm.parseBuffer(Buffer.from(buffer));
                        rawDuration = metadata.format.duration || 0;
                        console.log(`⏱️ Auto-calculated duration for ${speechFile}: ${rawDuration.toFixed(2)}s`);
                    }
                } catch (e) {
                    console.warn(`⚠️ Failed to auto-calculate duration for ${speechFile}`);
                }
            }

            const callDuration = rawDuration ? Math.round(rawDuration * 100) / 100 : 0;

            // ── SCRIPT DETECTION ──
            const hasHindiChars = /[\u0900-\u097F]/.test(task.prompt || "");
            const dominantScript = hasHindiChars ? "hindi" : (task.language?.toLowerCase() || "unknown");

            return {
                sl_no: index + 1,
                speechFile,
                transcription: task.prompt || "",
                callDuration,
                speechMode: "Read",
                topic: task.project || "General",
                status: sub.status,
                speakerUniqueId: profile.id || sub.user_id || "unknown",
                recordingDetails: {
                    channel: tech.channels === 1 ? "Mono" : "Stereo",
                    samplingFrequencyHz: tech.sampleRate || 16000,
                    bitsPerSample: tech.bitsPerSample || 16
                },
                languageDetails: { dominantScript },
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
        }));

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
