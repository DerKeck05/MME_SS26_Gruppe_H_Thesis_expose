import {prisma} from "../lib/prisma.js";

export async function createCalendarEntry(
    title: string,
    startDate: Date,
    endDate: Date,
    thesisId: number,
    description?: string
) {
    return prisma.calendarEntry.create({
        data: {
            title: title,
            description: description ?? "",
            startDate: startDate,
            endDate: endDate,
            thesisId: thesisId
        }
    });
}

export async function getCalendarEntriesByThesisId(thesisId: number) {
    return prisma.calendarEntry.findMany({
        where: { thesisId }
    });
}

export async function getCalendarEntryById(calendarId: number) {
    return prisma.calendarEntry.findUnique({
        where: { id: calendarId }
    });
}

interface UpdateCalendarEntryData {
    title?: string | undefined;
    description?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}

export async function updateCalendarEntry(
    calendarId: number,
    data: UpdateCalendarEntryData
) {
    return prisma.calendarEntry.update({
        where: {
            id: calendarId
        },
        data: {
            ...(data.title !== undefined && {
                title: data.title
            }),
            ...(data.description !== undefined && {
                description: data.description
            }),
            ...(data.startDate !== undefined && {
                startDate: data.startDate
            }),
            ...(data.endDate !== undefined && {
                endDate: data.endDate
            })
        }
    });
}


export async function deleteCalendarEntry(calendarId: number) {
    return prisma.calendarEntry.delete({
        where: { id: calendarId }
    });
}