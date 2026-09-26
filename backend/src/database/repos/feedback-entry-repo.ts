import {prisma} from "../lib/prisma.js";

export async function createFeedbackEntry(chapterId: number, content: string) {
    return await prisma.feedbackEntry.create({
        data: {
            chapterId,
            content
        }
    })
}

export async function getFeedbackEntriesByChapterId(chapterId: number) {
    return await prisma.feedbackEntry.findMany({
        where: { chapterId }
    })
}

export async function getFeedbackEntryById(feedbackEntryId: number) {
    return await prisma.feedbackEntry.findUnique({
        where: { id: feedbackEntryId }
    })
}

export async function updateFeedbackEntry(feedbackEntryId: number, content?: string) {
    return await prisma.feedbackEntry.update({
        where: { id: feedbackEntryId },
        data: {
            content
        }
    })
}

export async function deleteFeedbackEntry(feedbackEntryId: number) {
    return await prisma.feedbackEntry.delete({
        where: { id: feedbackEntryId }
    })
}