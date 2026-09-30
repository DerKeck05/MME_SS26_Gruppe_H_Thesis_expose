import {prisma} from "../lib/prisma.js";

//
// Basic CRUD Database Queries for Outline (Chapters)
// always just returns the result of a Prisma Query which is doing a postgres SQL query inside
//

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

// Gets the thesis information for the outline PDF export combined with the student and supervisor information
export async function getThesisForPDF(thesisId: number) {
    return prisma.thesis.findUnique({
        where: {
            id: thesisId
        }, include: {
            student: true,
            supervisor: true,

            //TODO hier auch noch Uni und Kurs mit einbauen
        }
    })
}