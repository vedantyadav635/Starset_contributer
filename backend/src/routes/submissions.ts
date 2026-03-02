import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadToBucket, copyBetweenBuckets, uploadToB2, generateAudioFileName } from "../utils/b2Upload";
import { validateAudio } from "../utils/audioValidator";
import { supabase } from "../db/supabase";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        file.mimetype.startsWith('audio/')
            ? cb(null, true)
            : cb(new Error('Only audio files are allowed'));
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// Background validation pipeline
// Runs AFTER the HTTP response has been sent to the user.
// 1. Validate audio (duration, silence, size)
// 2. If pass  → B2 server-side copy: raw → final
// 3. Update DB: validation_status, final_audio_url, final_file_id
// ─────────────────────────────────────────────────────────────────────────────
async function runValidationPipeline(
    submissionId: string,
    buffer: Buffer,
    mimeType: string,
    rawFileId: string,
    fileName: string,
): Promise<void> {
    console.log(`🔬 [PIPELINE] Starting validation for submission ${submissionId}`);

    try {
        // ── Step 1: Full audio validation ────────────────────────────────────
        const validation = await validateAudio(buffer, mimeType, {
            minDurationSeconds: 1.5,
            maxDurationSeconds: 90,
            minFileSizeBytes: 1_000,
        });

        console.log(`🎙️  [PIPELINE] Validation: passed=${validation.passed}, dur=${validation.durationSeconds.toFixed(2)}s`);

        if (!validation.passed) {
            // ── Validation failed: update DB, stay in raw ────────────────────
            console.log(`❌ [PIPELINE] Validation failed:`, validation.errors);
            await supabase
                .from('submissions')
                .update({
                    validation_status: 'auto_failed',
                    validation_errors: validation.errors,
                    validated_at: new Date().toISOString(),
                    duration_seconds: validation.durationSeconds || null,
                    storage_stage: 'raw',
                })
                .eq('id', submissionId);
            console.log(`📝 [PIPELINE] DB updated: validation failed`);
            return;
        }

        // ── Step 2: Copy raw → final (server-side, no re-download) ──────────
        console.log(`📋 [PIPELINE] Copying ${rawFileId} from raw → final bucket...`);
        const finalResult = await copyBetweenBuckets(rawFileId, fileName, 'final');

        // ── Step 3: Update DB with final URL + success status ────────────────
        await supabase
            .from('submissions')
            .update({
                validation_status: 'auto_passed',
                validation_errors: validation.warnings.length > 0 ? validation.warnings : null,
                validated_at: new Date().toISOString(),
                duration_seconds: validation.durationSeconds || null,
                audio_url: finalResult.url,         // final bucket URL
                final_file_id: finalResult.fileId,  // for admin approve pipeline
                storage_stage: 'final',
            })
            .eq('id', submissionId);

        console.log(`✅ [PIPELINE] Done: submission ${submissionId} is in FINAL bucket`);

    } catch (pipelineError: any) {
        console.error(`❌ [PIPELINE] Error for ${submissionId}:`, pipelineError?.message);
        // Don't crash — mark as failed so admin can investigate
        await supabase
            .from('submissions')
            .update({
                validation_status: 'pipeline_error',
                validation_errors: [pipelineError?.message || 'Unknown pipeline error'],
                validated_at: new Date().toISOString(),
                storage_stage: 'raw',
            })
            .eq('id', submissionId)
            .then(() => { });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /submissions/audio
// ─────────────────────────────────────────────────────────────────────────────
router.post("/audio", upload.single('audio'), async (req: Request, res: Response) => {
    try {
        const { taskId, userId } = req.body;
        const audioFile = req.file;

        if (!taskId || !userId) {
            return res.status(400).json({ error: "Missing required fields: taskId and userId are required" });
        }
        if (!audioFile) {
            return res.status(400).json({ error: "No audio file provided" });
        }

        console.log(`📤 Audio received: task=${taskId}, user=${userId}, size=${(audioFile.size / 1024).toFixed(1)} KB`);

        // ── 1. Quick sanity check (synchronous, very fast) ───────────────────
        if (audioFile.size < 500) {
            return res.status(422).json({
                error: "Audio recording appears to be empty. Please try again.",
            });
        }

        // ── 2. Upload directly to RAW bucket ─────────────────────────────────
        const fileName = generateAudioFileName(userId, taskId);
        const rawResult = await uploadToBucket(
            audioFile.buffer,
            fileName,
            audioFile.mimetype,
            'raw'
        );
        console.log(`✅ Uploaded to RAW bucket: ${rawResult.fileId}`);

        // ── 3. Save to DB with status 'pending' (raw stage) ──────────────────
        const { data: submission, error: dbError } = await supabase
            .from('submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                audio_url: rawResult.url,           // raw URL (updated to final after validation)
                raw_audio_url: rawResult.url,       // permanent raw reference
                raw_file_id: rawResult.fileId,      // needed for server-side copy to final
                file_size: audioFile.size,
                mime_type: audioFile.mimetype,
                status: 'pending_validation',
                storage_stage: 'raw',
                validation_status: 'pending',
                submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (dbError) {
            console.error('❌ DB error:', dbError);
            return res.status(500).json({ error: "Failed to save submission", details: dbError.message });
        }

        // ── 4. Return success immediately so user isn't waiting ───────────────
        res.status(201).json({
            success: true,
            message: "Audio submitted successfully. Validation in progress...",
            submission: {
                id: submission.id,
                rawAudioUrl: rawResult.url,
                status: 'pending_validation',
                validationStatus: 'pending',
            },
        });

        // ── 5. Run full validation pipeline in background (non-blocking) ──────
        // We pass the buffer from memory — it's still available after res.json()
        setImmediate(() => {
            runValidationPipeline(
                submission.id,
                audioFile.buffer,
                audioFile.mimetype,
                rawResult.fileId,
                fileName,
            ).catch(err => console.error('❌ Unhandled pipeline error:', err));
        });

    } catch (error: any) {
        console.error('❌ Submission error:', error?.message);
        return res.status(500).json({
            error: "Failed to process audio submission",
            details: error.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /submissions/image
// ─────────────────────────────────────────────────────────────────────────────
router.post("/image", upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { taskId, userId } = req.body;
        const imageFile = req.file;

        if (!taskId || !userId || !imageFile) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileName = `images/${userId}/${taskId}_${timestamp}_${randomSuffix}.${imageFile.mimetype.split('/')[1]}`;
        const fileUrl = await uploadToB2(imageFile.buffer, fileName, imageFile.mimetype);

        const { data: submission, error: dbError } = await supabase
            .from('submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                image_url: fileUrl,
                file_size: imageFile.size,
                mime_type: imageFile.mimetype,
                status: 'pending_validation',
                validation_status: 'auto_passed',
                storage_stage: 'raw',
                submitted_at: new Date().toISOString(),
                validated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (dbError) return res.status(500).json({ error: "Failed to save submission", details: dbError.message });

        return res.status(201).json({
            success: true,
            message: "Image submitted successfully",
            submission: { id: submission.id, imageUrl: fileUrl, status: submission.status },
        });

    } catch (error: any) {
        return res.status(500).json({ error: "Failed to process image submission", details: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /submissions/text
// ─────────────────────────────────────────────────────────────────────────────
router.post("/text", async (req: Request, res: Response) => {
    try {
        const { taskId, userId, textContent, selectedOption } = req.body;

        if (!taskId || !userId || (!textContent && !selectedOption)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data: submission, error: dbError } = await supabase
            .from('submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                text_content: textContent,
                selected_option: selectedOption,
                status: 'pending_validation',
                validation_status: 'auto_passed',
                storage_stage: 'n/a',
                submitted_at: new Date().toISOString(),
                validated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (dbError) return res.status(500).json({ error: "Failed to save submission", details: dbError.message });

        return res.status(201).json({
            success: true,
            message: "Text submitted successfully",
            submission: { id: submission.id, status: submission.status },
        });

    } catch (error: any) {
        return res.status(500).json({ error: "Failed to process text submission", details: error.message });
    }
});

export default router;
