import { prisma } from "../lib/prisma.js";


export async function createSupervisor(
    name: string,
    email: string,
    passwordHash: string,
    chair: string,
    universityId: number,
    courseIds: number[]
) {
    return prisma.supervisor.create({
        data: {
            name,
            email,
            passwordHash,
            chair,
            universityId,
            courses: {
                connect: courseIds.map((courseId) => ({
                    id: courseId
                }))
            }
        }
    });
}


export async function getSupervisorById(supervisorId: number) {
    return prisma.supervisor.findUnique({
        where: {
            id: supervisorId
        }
    });
}


export async function getSupervisorByEmail(email: string) {
    return prisma.supervisor.findUnique({
        where: {
            email: email
        }
    });
}


export async function updateSupervisor(
    supervisorId: number,
    name?: string,
    email?: string,
    passwordHash?: string,
    chair?: string
) {

    const data: {
        name?: string;
        email?: string;
        passwordHash?: string;
        chair?: string;
    } = {};


    if (name !== undefined) {
        data.name = name;
    }


    if (email !== undefined) {
        data.email = email;
    }


    if (passwordHash !== undefined) {
        data.passwordHash = passwordHash;
    }


    if (chair !== undefined) {
        data.chair = chair;
    }


    return prisma.supervisor.update({
        where: {
            id: supervisorId
        },
        data: data
    });
}


export async function deleteSupervisor(supervisorId: number) {
    return prisma.supervisor.delete({
        where: {
            id: supervisorId
        }
    });
}


export async function getSupervisorsByUniversityAndCourse(
    universityId: number,
    courseId: number
) {
    return prisma.supervisor.findMany({
        where: {
            universityId: universityId,
            courses: {
                some: {
                    id: courseId
                }
            }
        },
        select: {
            id: true,
            name: true,
            chair: true
        }
    });
}