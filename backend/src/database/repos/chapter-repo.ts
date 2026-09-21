import {prisma} from "../lib/prisma.js";

interface Chapter {
    title: string;
    parentId: number | null;
    position: number;
    thesisId: number;
}

export async function createChapter(chapter: Chapter) {
    return prisma.chapter.create({
        data: chapter
    });
}

export async function getChaptersByThesisId(thesisId: number) {
    return prisma.chapter.findMany({
        where: {thesisId},
        orderBy: {position: "asc"}
    });
}

export async function getChapterById(chapterId: number) {
    return prisma.chapter.findUnique({
        where: {
            id: chapterId
        }
    });
}

interface UpdateChapterData {
    title?: string,
    position?: number,
    parentId?: number | null
}

export async function updateChapter(chapterId: number, data: UpdateChapterData) {
    return prisma.chapter.update({
        where: {id: chapterId},
        data
    });
}

export async function deleteChapter(chapterId: number) {
    return prisma.chapter.delete({
        where: {id: chapterId}
    });
}