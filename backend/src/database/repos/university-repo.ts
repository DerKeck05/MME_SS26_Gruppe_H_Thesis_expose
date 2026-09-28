import {prisma} from "../lib/prisma.js";


export async function getAllUniversities() {
    return prisma.university.findMany({
        orderBy: {
            name: "asc"
        }
    });
}


export async function getCoursesByUniversityId(
    universityId: number
) {

    return prisma.course.findMany({
        where: {
            universityId: universityId
        },
        orderBy: {
            name: "asc"
        }
    });
}


export async function getChairsByUniversityId(
    universityId: number
) {
    return prisma.chair.findMany({
        where: {
            universityId: universityId
        },

        orderBy: {
            name: "asc"
        }
    });
}


export async function getCoursesByUniversityAndChair(
    universityId: number,
    chairId: number
) {

    const chair = await prisma.chair.findFirst({

        where: {
            id: chairId,
            universityId: universityId
        },

        select: {

            courses: {

                orderBy: {
                    name: "asc"
                }
            }
        }
    });


    if (chair == null) {
        return [];
    }


    return chair.courses;
}