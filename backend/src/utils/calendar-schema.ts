import { z } from "zod";

export const createCalendarEntrySchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
}).refine(
    data => data.endDate >= data.startDate,
    {
        message: "endDate must be after startDate",
        path: ["endDate"]
    }
);

export const updateCalendarEntrySchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
}).refine(
    data =>
        data.startDate === undefined ||
        data.endDate === undefined ||
        data.endDate >= data.startDate,
    {
        message: "endDate must be after startDate",
        path: ["endDate"]
    }
);