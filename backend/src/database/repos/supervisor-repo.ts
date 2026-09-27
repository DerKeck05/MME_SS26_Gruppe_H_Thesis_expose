import {prisma} from "../lib/prisma.js";

export async function createSupervisor(
    name: string,
    email: string,
    passwordHash: string,
    universityId: number,
    chairId: number,
    courseIds: number[]
) {

    /*
     * Ausgewählten Lehrstuhl laden.
     * Dabei auch alle Studiengänge laden,
     * die diesem Lehrstuhl zugeordnet sind.
     */
    const selectedChair = await prisma.chair.findFirst({

        where: {
            id: chairId,
            universityId: universityId
        },

        include: {
            courses: {
                select: {
                    id: true
                }
            }
        }
    });


    if (selectedChair == null) {

        throw new Error(
            "Lehrstuhl wurde nicht gefunden"
        );
    }


    /*
     * IDs der Studiengänge,
     * die zu diesem Lehrstuhl gehören.
     */
    const allowedCourseIds =
        selectedChair.courses.map(
            (course) => course.id
        );


    /*
     * Prüfen, ob wirklich nur erlaubte
     * Studiengänge geschickt wurden.
     */
    for (const courseId of courseIds) {

        if (!allowedCourseIds.includes(courseId)) {

            throw new Error(
                "Ein ausgewählter Studiengang gehört nicht zu diesem Lehrstuhl"
            );
        }
    }


    /*
     * Professor anlegen.
     *
     * chair bleibt zusätzlich als Text bestehen,
     * damit alter Code weiterhin funktioniert.
     *
     * chairId ist die neue echte Beziehung.
     */
    return prisma.supervisor.create({
        data: {
            name,
            email,
            passwordHash,

            chair: selectedChair.name,

            universityId,
            chairId,
            courses: {

                connect: courseIds.map(
                    (courseId) => ({
                        id: courseId
                    })
                )
            }
        }
    });
}


export async function getSupervisorById(
    supervisorId: number
) {

    return prisma.supervisor.findUnique({
        where: {
            id: supervisorId
        }
    });
}


export async function getSupervisorByEmail(
    email: string
) {

    return prisma.supervisor.findUnique({
        where: {
            email: email
        }
    });
}


/*
export async function updateSupervisor(
    supervisorId: number,
    name?: string,
    email?: string,
    passwordHash?: string,
    chair?: string
) {
    return prisma.supervisor.update({
        where: {
            id: supervisorId
        },
        data: {
            name,
            email,
            passwordHash,
            chair
        }
    });
}
*/


export async function deleteSupervisor(
    supervisorId: number
) {

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