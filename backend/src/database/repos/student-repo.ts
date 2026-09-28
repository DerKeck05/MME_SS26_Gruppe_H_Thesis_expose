import {prisma} from "../lib/prisma.js";


export async function getStudentById(
    studentId: number
) {

    return prisma.student.findUnique({

        where: {
            id: studentId
        },

        include: {
            thesis: true
        }
    });
}


export async function getStudentByName(
    studentName: string
) {

    return prisma.student.findMany({

        where: {
            name: studentName
        }
    });
}


/*
 * Alle Studenten eines Professors.
 *
 * thesis wird direkt mitgeladen,
 * damit das Professor-Dashboard weiß:
 *
 * - Student wartet noch
 * - oder Student hat bereits eine Thesis
 */
export async function getStudentsBySupervisorId(
    supervisorId: number
) {

    return prisma.student.findMany({

        where: {
            supervisorId: supervisorId
        },

        include: {
            thesis: true
        },

        orderBy: {
            name: "asc"
        }
    });
}


export async function getStudentByEmail(
    email: string
) {

    return prisma.student.findUnique({

        where: {
            email: email
        }
    });
}


/*
 * Student registrieren
 */
export async function createStudent(
    name: string,
    email: string,
    passwordHash: string,
    universityId: number,
    courseId: number,
    supervisorId: number
) {

    /*
     * Studiengang prüfen.
     *
     * Er muss wirklich zur gewählten
     * Hochschule gehören.
     */
    const selectedCourse =
        await prisma.course.findFirst({

            where: {
                id: courseId,
                universityId: universityId
            }
        });


    if (selectedCourse == null) {

        throw new Error(
            "Studiengang wurde nicht gefunden"
        );
    }


    /*
     * Professor prüfen.
     *
     * Professor muss:
     *
     * - zur Hochschule gehören
     * - den gewählten Studiengang betreuen
     */
    const selectedSupervisor =
        await prisma.supervisor.findFirst({

            where: {

                id: supervisorId,

                universityId: universityId,

                courses: {

                    some: {
                        id: courseId
                    }
                }
            }
        });


    if (selectedSupervisor == null) {

        throw new Error(
            "Professor gehört nicht zu diesem Studiengang"
        );
    }


    /*
     * Student erstellen.
     *
     * course bleibt zusätzlich als Text,
     * weil bestehende Screens dieses Feld
     * noch benutzen.
     */
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


export async function hasSupervisor(
    id: number
) {

    const student =
        await prisma.student.findUnique({

            where: {
                id: id
            },

            select: {
                supervisorId: true
            }
        });


    return student?.supervisorId != null;
}


export async function deleteStudent(
    studentId: number
) {

    return prisma.student.delete({

        where: {
            id: studentId
        }
    });
}