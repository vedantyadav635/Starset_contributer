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
                console.log(`🔍 [EXPORT] Missing duration for ${speechFile}. Attempting on-the-fly calculation...`);
                try {
                    const mm = await import('music-metadata');
                    const response = await fetch(fileUrl);
                    if (response.ok) {
                        const buffer = await response.arrayBuffer();
                        const metadata = await mm.parseBuffer(Buffer.from(buffer));
                        rawDuration = metadata.format.duration || 0;
                        console.log(`⏱️ [EXPORT] Success: ${speechFile} = ${rawDuration.toFixed(2)}s`);
                    } else {
                        console.error(`❌ [EXPORT] Fetch failed for ${speechFile}: ${response.status} ${response.statusText}`);
                    }
                } catch (e: any) {
                    console.error(`⚠️ [EXPORT] Parser error for ${speechFile}:`, e?.message || e);
                }
            } else if (!rawDuration) {
                console.log(`⚠️ [EXPORT] Skip: no duration found and file is not .webm or URL is missing: ${speechFile}`);
            }

            const callDuration = rawDuration ? Math.round(rawDuration * 100) / 100 : 0;

            // ── SCRIPT DETECTION ──
            const hasHindiChars = /[\u0900-\u097F]/.test(task.prompt || "");
            const dominantScript = hasHindiChars ? "hindi" : (task.language?.toLowerCase() || "unknown");

            // ── AGE GROUP CALCULATION ──
            const age = profile.age || 0;
            let ageGroup = "Unknown";
            if (age > 0) {
                if (age < 18) ageGroup = "Below 18";
                else if (age <= 25) ageGroup = "18-25";
                else if (age <= 35) ageGroup = "26-35";
                else if (age <= 45) ageGroup = "36-45";
                else if (age <= 60) ageGroup = "46-60";
                else ageGroup = "60+";
            }

            return {
                sl_no: index + 1,
                speechFile: (speechFile || "").toLowerCase().substring(0, 8),
                transcription: task.prompt || "",
                speechMode: "Read",
                status: sub.status,
                speakerUniqueId: (profile.id || sub.user_id || "unknown").toLowerCase().substring(0, 8),

                speakerInfo: {
                    age: profile.age || null,
                    ageGroup,
                    gender: profile.gender === "Male" ? "M" : profile.gender === "Female" ? "F" : "O",
                    city: profile.city || null,
                    state: profile.state || null
                },

                recordingDetails: {
                    channel: tech.channels === 1 ? "Mono" : "Stereo",
                    samplingRateHz: tech.sampleRate || 16000,
                    bitsPerSample: tech.bitsPerSample || 16,
                    durationSec: callDuration,
                    acousticEnvironment: "indoor_quiet",
                    microphoneType: "mobile_smartphone"
                },

                consent: {
                    recordedForAi: true,
                    rightsForCommercialUse: true,
                    usedForGlobalDataset: true,
                    anonymized: true
                },

                tags: {
                    domain: task.project || "personal_conversation",
                    scenario: (task.title || "").toLowerCase().replace(/\s+/g, '_'),
                    languageMix: dominantScript === "hindi" ? "pure_hindi" : (task.language || "pure_english"),
                    speakerRole: "caller",
                    emotion: "neutral",
                    promptType: "conversational_call"
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
