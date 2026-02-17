import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadToB2, generateAudioFileName } from "../utils/b2Upload";
import { supabase } from "../db/supabase";

const router = Router();

// Configure multer for memory storage (we'll upload directly to B2)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
    },
    fileFilter: (_req, file, cb) => {
        // Accept audio files only
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'));
        }
    },
});

/**
 * POST /submissions/audio
 * Submit audio recording for a task
 */
router.post("/audio", upload.single('audio'), async (req: Request, res: Response) => {
    try {
        const { taskId, userId } = req.body;
        const audioFile = req.file;

        // Validate inputs
        if (!taskId || !userId) {
            return res.status(400).json({
                error: "Missing required fields: taskId and userId are required"
            });
        }

        if (!audioFile) {
            return res.status(400).json({
                error: "No audio file provided"
            });
        }

        console.log(`📤 Uploading audio for task ${taskId}, user ${userId}`);
        console.log(`📊 File size: ${(audioFile.size / 1024).toFixed(2)} KB`);

        // Generate unique filename
        const fileName = generateAudioFileName(userId, taskId);

        // Upload to B2
        const fileUrl = await uploadToB2(
            audioFile.buffer,
            fileName,
            audioFile.mimetype
        );

        console.log(`✅ Audio uploaded successfully: ${fileUrl}`);

        // Store submission in database
        const { data: submission, error: dbError } = await supabase
            .from('submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                audio_url: fileUrl,
                file_size: audioFile.size,
                mime_type: audioFile.mimetype,
                status: 'pending_validation',
                submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (dbError) {
            console.error('❌ Database error:', dbError);
            return res.status(500).json({
                error: "Failed to save submission to database",
                details: dbError.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Audio submitted successfully",
            submission: {
                id: submission.id,
                audioUrl: fileUrl,
                status: submission.status,
            },
        });

    } catch (error: any) {
        console.error('❌ Submission error:', error);
        return res.status(500).json({
            error: "Failed to process audio submission",
            details: error.message
        });
    }
});

/**
 * POST /submissions/image
 * Submit image for a task
 */
router.post("/image", upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { taskId, userId } = req.body;
        const imageFile = req.file;

        if (!taskId || !userId || !imageFile) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        // Generate unique filename for image
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileName = `images/${userId}/${taskId}_${timestamp}_${randomSuffix}.${imageFile.mimetype.split('/')[1]}`;

        // Upload to B2
        const fileUrl = await uploadToB2(
            imageFile.buffer,
            fileName,
            imageFile.mimetype
        );

        // Store submission in database
        const { data: submission, error: dbError } = await supabase
            .from('submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                image_url: fileUrl,
                file_size: imageFile.size,
                mime_type: imageFile.mimetype,
                status: 'pending_validation',
                submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (dbError) {
            return res.status(500).json({
                error: "Failed to save submission",
                details: dbError.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Image submitted successfully",
            submission: {
                id: submission.id,
                imageUrl: fileUrl,
                status: submission.status,
            },
        });

    } catch (error: any) {
        console.error('❌ Image submission error:', error);
        return res.status(500).json({
            error: "Failed to process image submission",
            details: error.message
        });
    }
});

/**
 * POST /submissions/text
 * Submit text/annotation for a task
 */
router.post("/text", async (req: Request, res: Response) => {
    try {
        const { taskId, userId, textContent, selectedOption } = req.body;

        if (!taskId || !userId || (!textContent && !selectedOption)) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        // Store submission in database
        const { data: submission, error: dbError } = await supabase
            .from('submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                text_content: textContent,
                selected_option: selectedOption,
                status: 'pending_validation',
                submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (dbError) {
            return res.status(500).json({
                error: "Failed to save submission",
                details: dbError.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Text submitted successfully",
            submission: {
                id: submission.id,
                status: submission.status,
            },
        });

    } catch (error: any) {
        console.error('❌ Text submission error:', error);
        return res.status(500).json({
            error: "Failed to process text submission",
            details: error.message
        });
    }
});

export default router;
