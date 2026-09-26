import {prisma} from "../lib/prisma.js";

export async function createCalendarEntry(
    title: string,
    startDate: Date,
    endDate: Date,
    thesisId: number,
    allDay: boolean,
    description?: string,
) {
    console.log(`Created Calendar Entry with Title: ${title}`);

    return prisma.calendarEntry.create({
        data: {
            title: title,
            description: description ?? "",
            startDate: startDate,
            endDate: endDate,
            thesisId: thesisId,
            allDay: allDay,
        }
    });
}

export async function getCalendarEntriesByThesisId(thesisId: number) {
    console.log("Get Calendar Entries with thesisId ${thesisId}");

    return prisma.calendarEntry.findMany({
        where: { thesisId }
    });
}

export async function getCalendarEntryById(calendarId: number) {
    console.log("Get Calendar Entry with ID " + calendarId);

    return prisma.calendarEntry.findUnique({
        where: { id: calendarId }
    });
}

interface UpdateCalendarEntryData {
    title?: string | undefined;
    description?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    allDay?: boolean | undefined;
}

export async function updateCalendarEntry(
    calendarId: number,
    data: UpdateCalendarEntryData
) {
    console.log("Update Calendar Entry with ID: " + calendarId);

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
            }),
            ...(data.allDay !== undefined && {
                allDay: data.allDay
            })
        }
    });
}


export async function deleteCalendarEntry(calendarId: number) {
    console.log("Delete Calendar Entry with ID: " + calendarId);

    return prisma.calendarEntry.delete({
        where: { id: calendarId }
    });
}