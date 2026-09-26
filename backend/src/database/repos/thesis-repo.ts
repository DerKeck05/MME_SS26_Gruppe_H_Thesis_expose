import { prisma } from "../lib/prisma.js";


export async function getThesisById(thesisId: number) {
    return prisma.thesis.findUnique({
        where: {
            id: thesisId
        }
    });
}


export async function getThesisBySupervisorId(supervisorId: number) {
    return prisma.thesis.findMany({
        where: {
            supervisorId: supervisorId
        }
    });
}


export async function getThesesByStudentId(studentId: number) {
    return prisma.thesis.findMany({
        where: {
            studentId: studentId
        }
    });
}


export async function createThesis(
    studentId: number,
    supervisorId: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date
) {
    return prisma.thesis.create({
        data: {
            studentId: studentId,
            supervisorId: supervisorId,
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate
        }
    });
}


export async function updateThesis(
    thesisId: number,
    title?: string,
    description?: string
) {

    const data: {
        title?: string;
        description?: string;
    } = {};


    if (title !== undefined) {
        data.title = title;
    }


    if (description !== undefined) {
        data.description = description;
    }


    return prisma.thesis.update({
        where: {
            id: thesisId
        },
        data: data
    });
}


export async function updateThesisDates(
    thesisId: number,
    startDate?: Date,
    endDate?: Date
) {

    const data: {
        startDate?: Date;
        endDate?: Date;
    } = {};


    if (startDate !== undefined) {
        data.startDate = startDate;
    }


    if (endDate !== undefined) {
        data.endDate = endDate;
    }


    return prisma.thesis.update({
        where: {
            id: thesisId
        },
        data: data
    });
}


export async function deleteThesis(thesisId: number) {
    return prisma.thesis.delete({
        where: {
            id: thesisId
        }
    });
}