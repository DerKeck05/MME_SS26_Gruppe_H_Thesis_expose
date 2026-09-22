import { z } from "zod";

export const createChapterSchema = z.object({
    title: z.string().min(1, "Title is required"),
    parentId: z.number().int().nullable().optional(),
    position: z.number().int().min(0)
});

export const updateChapterSchema = z.object({
    title: z.string().min(1).optional(),
    parentId: z.number().int().nullable().optional(),
    position: z.number().int().min(0).optional()
});