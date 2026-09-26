import {z} from "zod";
import {fromZonedTime} from "date-fns-tz";

const berlinTimeToDate = (value: string): Date => {
    return fromZonedTime(value, "Europe/Berlin");
};

export const createCalendarEntrySchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),

    startDate: z.string().transform(berlinTimeToDate),
    endDate: z.string().transform(berlinTimeToDate),

    allDay: z.boolean()

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

    startDate: z.string().transform(berlinTimeToDate).optional(),
    endDate: z.string().transform(berlinTimeToDate).optional(),

    allDay: z.boolean().optional(),

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