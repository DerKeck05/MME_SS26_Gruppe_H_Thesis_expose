import { prisma } from "../lib/prisma.js";


/*
This function loads all universities
from the database.
findMany is used because there can be
more than one university in the database.
The universities are sorted alphabetically
by their name.
"asc" means ascending,
so the order is from A to Z.
*/
export async function getAllUniversities() {

    return prisma.university.findMany({

        orderBy: {
            name: "asc"
        }
    });
}


/*
This function loads all courses
that belong to one university.
The universityId is used as a filter.
Only courses with the same universityId
are returned.
*/
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


/*
This function loads all chairs
that belong to one university.
The universityId is used as a filter.
Only chairs from the selected university
are returned.
*/
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


/*
This function loads all courses
that belong to one specific chair.
The universityId and chairId are both checked.
This makes sure that the selected chair
really belongs to the selected university.
*/
export async function getCoursesByUniversityAndChair(
    universityId: number,
    chairId: number
) {

    /*
    First I search for the selected chair
    The chair has to have the selected chair ID, belong to the selected university
    */
    const chair =
        await prisma.chair.findFirst({

            where: {
                id: chairId,
                universityId: universityId
            },

            /*
            I only need the courses
            connected to this chair.
            */
            select: {

                courses: {

                    orderBy: {
                        name: "asc"
                    }
                }
            }
        });


    /*
    If no matching chair was found,
    an empty array is returned.
    This means that there are no courses
    that can be shown for this selection.
    */
    if (chair == null) {
        return [];
    }


    /*
    If the chair was found,
    the connected courses are returned.
    */
    return chair.courses;
}