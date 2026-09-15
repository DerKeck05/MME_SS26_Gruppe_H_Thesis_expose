import {prisma} from "../lib/prisma.js";


export async function createChapter(title: string, content: string, chapterNumber: string, thesisId: number) {
    return prisma.chapter.create({
        data: {
            title,
            content,
            chapterNumber,
            thesisId
        }
    });
}

export async function getChaptersByThesisId(thesisId: number) {
    return prisma.chapter.findMany({
        where: { thesisId }
    });
}

export async function getChapterById(chapterId: number) {
    return prisma.chapter.findUnique({
        where: { id: chapterId }
    });
}

interface UpdateChapterData {
    title?: string, chapterNumber?: string
}

export async function updateChapter(chapterId: number, data: UpdateChapterData) {
    return prisma.chapter.update({
        where: { id: chapterId },
        data
    });
}

export async function deleteChapter(chapterId: number) {
    return prisma.chapter.delete({
        where: { id: chapterId }
    });
}