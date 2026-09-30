import { z } from "zod";
//
// Verifies the Chapter Data with zod, so that the data has actually the right data type
//

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