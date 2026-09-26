import { prisma } from "../lib/prisma.js";


export async function getStudentById(studentId: number) {
    return prisma.student.findUnique({
        where: {
            id: studentId
        },
        include: {
            thesis: true
        }
    });
}


export async function getStudentByName(studentName: string) {
    return prisma.student.findMany({
        where: {
            name: studentName
        }
    });
}


export async function getStudentsBySupervisorId(supervisorId: number) {
    return prisma.student.findMany({
        where: {
            supervisorId: supervisorId
        },
        select: {
            id: true,
            name: true,
            email: true,
            course: true,
            universityId: true,
            supervisorId: true,
            thesis: {
                select: {
                    id: true,
                    title: true,
                    startDate: true,
                    endDate: true
                }
            }
        }
    });
}


export async function getStudentByEmail(email: string) {
    return prisma.student.findUnique({
        where: {
            email: email
        }
    });
}


export async function createStudent(
    name: string,
    email: string,
    passwordHash: string,
    universityId: number,
    courseId: number,
    supervisorId: number
) {

    const selectedCourse = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });


    if (selectedCourse == null) {
        throw new Error("Kurs nicht gefunden");
    }


    return prisma.student.create({
        data: {
            name,
            email,
            passwordHash,
            course: selectedCourse.name,
            universityId,
            courseId,
            supervisorId
        }
    });
}


export async function assignSupervisor(
    id: number,
    supervisorId: number
) {
    return prisma.student.update({
        where: {
            id: id
        },
        data: {
            supervisorId: supervisorId
        }
    });
}


export async function updateStudent(
    studentId: number,
    name?: string,
    email?: string,
    course?: string
) {

    const data: {
        name?: string;
        email?: string;
        course?: string;
    } = {};


    if (name !== undefined) {
        data.name = name;
    }


    if (email !== undefined) {
        data.email = email;
    }


    if (course !== undefined) {
        data.course = course;
    }


    return prisma.student.update({
        where: {
            id: studentId
        },
        data: data
    });
}


export async function hasSupervisor(id: number) {

    const student = await prisma.student.findUnique({
        where: {
            id: id
        },
        select: {
            supervisorId: true
        }
    });


    return student?.supervisorId != null;
}


export async function deleteStudent(studentId: number) {
    return prisma.student.delete({
        where: {
            id: studentId
        }
    });
}


export async function getAllStudents() {
    return prisma.student.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            course: true,
            supervisorId: true,
            thesis: {
                select: {
                    id: true,
                    title: true,
                    endDate: true
                }
            }
        }
    });
}