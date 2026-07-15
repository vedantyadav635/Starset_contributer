import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.issues,
                });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};

export const CreateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(100),
        type: z.enum(["Audio Collection", "Image Collection", "Text Annotation", "Image Labeling", "Evaluation", "Playlist"]),
        compensation: z.number().positive(),
        currency: z.string().length(3).default("INR"),
        estimated_time_min: z.number().positive(),
        status: z.enum(["AVAILABLE", "IN_PROGRESS", "VALIDATING", "ACCEPTED", "NOT_ACCEPTED", "active", "paused", "completed", "deleted"]).default("AVAILABLE"),
        language: z.string().min(2).max(50),
        project: z.string().optional(),
        difficulty: z.enum(["Beginner", "Intermediate", "Expert"]).default("Beginner"),
        prompt: z.string().optional(),
        instructions: z.string().optional(),
        ai_capability: z.string().optional(),
        data_usage: z.string().optional(),
        image_url: z.string().url().optional().or(z.literal("").optional()).nullable(),
        requirements: z.array(z.string()).optional(),
    }),
});
