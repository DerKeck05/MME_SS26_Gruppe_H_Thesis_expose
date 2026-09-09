import {prisma} from "../lib/prisma.js";

export async function createCalendarEntry(title: string, date: Date, userId: number, description?: string) {
    return prisma.calendarEntry.create({
        data: {
            title,
            description,
            date,
            userId
        }
    });
}

export async function getCalendarEntriesByUserId(userId: number) {
    return prisma.calendarEntry.findMany({
        where: { userId }
    });
}

export async function getCalendarEntryById(calendarId: number) {
    return prisma.calendarEntry.findUnique({
        where: { id: calendarId }
    });
}

export async function updateCalendarEntry(calendarId: number, title?: string, description?: string, date?: Date) {
    return prisma.calendarEntry.update({
        where: { id: calendarId },
        data: {
            title,
            description,
            date
        }
    });
}

export async function deleteCalendarEntry(calendarId: number) {
    return prisma.calendarEntry.delete({
        where: { id: calendarId }
    });
}