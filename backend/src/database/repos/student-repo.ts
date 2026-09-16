import {prisma} from "../lib/prisma.js";

export async function getStudentById(studentId: number) {
    return prisma.student.findUnique({
        where: {id: studentId}
    });
}

export async function getStudentByName(studentName: string) {
    return prisma.student.findUnique({
        where: {name: studentName}
    });
}

export async function getStudentsBySupervisorId(supervisorId: number) {
    return prisma.student.findMany({
        where: {supervisorId: supervisorId}
    });
}

export async function createStudent(name: string, email: string, passwordHash: string, course: string) {
    return prisma.student.create({
        data: {
            name,
            email,
            passwordHash,
            course
        }
    });
}

export async function assignSupervisor(id: number, supervisorId: number) {
    return prisma.student.update({
        where: {id: id},
        data: {
            supervisorId: supervisorId,
        }
    })
}

export async function hasSupervisor(id: number) {
    const student = await prisma.student.findUnique({
        where: {id: id},
        select: {supervisorId: true}
    });

    return student?.supervisorId != null;
}

export async function updateStudent(studentId: number, name?: string, email?: string, passwordHash?: string, course?: string) {
    return prisma.student.update({
        where: {
            id: studentId
        },
        data: {
            name,
            email,
            passwordHash,
            course
        }
    });
}

export async function deleteStudent(studentId: number) {
    return prisma.student.delete({
        where: {id: studentId}
    });
}
