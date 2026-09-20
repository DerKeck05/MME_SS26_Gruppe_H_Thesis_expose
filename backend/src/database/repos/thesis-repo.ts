import {prisma} from "../lib/prisma.js";

export async function getThesisById(thesisId: number) {
    return prisma.thesis.findUnique({
        where: { id: thesisId }
    });
}

export async function getThesisBySupervisorId(supervisorId: number) {
    return prisma.thesis.findMany({
        where: { supervisorId }
    });
}

export async function getThesesByStudentId(studentId: number) {
    return prisma.thesis.findMany({
        where: { studentId }
    });
}

export async function createThesis(studentId: number, title: string, description: string, startDate: Date, endDate: Date) {
    return prisma.thesis.create({
        data: {
            studentId,
            title,
            description,
            startDate,
            endDate
        }
    });
}

export async function updateThesis(thesisId: number, title?: string, description?: string) {
    return prisma.thesis.update({
        where: { id: thesisId },
        data: {
            title,
            description
        }
    });
}

export async function updateThesisDates(thesisId: number, startDate?: Date, endDate?: Date) {
    return prisma.thesis.update({
        where: { id: thesisId },
        data: {
            startDate,
            endDate
        }
    });
}

export async function deleteThesis(thesisId: number) {
    return prisma.thesis.delete({
        where: { id: thesisId }
    });
}