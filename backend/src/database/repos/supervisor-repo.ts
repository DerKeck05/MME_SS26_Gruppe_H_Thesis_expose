import { prisma } from "../lib/prisma.js";


/*
This function creates a new supervisor.
It receives:the name,the email,the hashed password,the university ID,the chair ID
a list of course IDs
Before the supervisor is created,
the selected chair and courses are checked.
*/
export async function createSupervisor(
    name: string,
    email: string,
    passwordHash: string,
    universityId: number,
    chairId: number,
    courseIds: number[]
) {

    /*
    First I search for the selected chair.
    The chair has to have the selected chair ID, belong to the selected university
    The courses connected to the chair
    are also loaded because I need them
    for the next check.
    */
    const selectedChair =
        await prisma.chair.findFirst({

            where: {
                id: chairId,
                universityId: universityId
            },

            include: {

                courses: {

                    /*
                    I only need the IDs of the courses.
                    The other course information is not needed here.
                    */
                    select: {
                        id: true
                    }
                }
            }
        });


    /*
    If no matching chair was found,
    the registration cannot continue.
    */
    if (selectedChair == null) {

        throw new Error(
            "Lehrstuhl wurde nicht gefunden"
        );
    }


    /*
    This array will contain the IDs
    of all courses that belong to the selected chair.
    */
    const allowedCourseIds: number[] = [];


    /*
    I go through all courses of the chair
    and save their IDs in the array.
    */
    for (const course of selectedChair.courses) {

        allowedCourseIds.push(
            course.id
        );
    }


    /*
    Now I check every course that was selected
    during the supervisor registration.
    Every selected course has to belong
    to the selected chair.
    */
    for (const courseId of courseIds) {

        /*
        includes checks if the selected course ID
        exists inside allowedCourseIds.
        */
        if (!allowedCourseIds.includes(courseId)) {

            throw new Error(
                "Ein ausgewählter Studiengang gehört nicht zu diesem Lehrstuhl"
            );
        }
    }


    /*
    Prisma needs objects containing the course IDs
    to connect the supervisor with the courses.
    */
    const courseConnections: { id: number }[] = [];


    for (const courseId of courseIds) {

        courseConnections.push({
            id: courseId
        });
    }


    /*
    After all values were checked,
    the supervisor can be saved in the database.
    The chair name is still saved as text
    because older parts of the application
    still use this field.
    chairId is the actual database relation.
    */
    return prisma.supervisor.create({

        data: {

            name: name,

            email: email,

            passwordHash: passwordHash,

            chair: selectedChair.name,

            universityId: universityId,

            chairId: chairId,

            /*
            The supervisor is connected
            to all selected courses.
            */
            courses: {

                connect: courseConnections
            }
        }
    });
}


/*
This function searches for one supervisor
with a specific ID.
findUnique is used because every supervisor
has a unique ID.
If no supervisor with this ID exists,
Prisma returns null.
*/
export async function getSupervisorById(
    supervisorId: number
) {

    return prisma.supervisor.findUnique({

        where: {
            id: supervisorId
        }
    });
}


/*
This function searches for one supervisor
with a specific email address.
findUnique is used because the email
is unique for every supervisor.
This function can for example
be used during login.
*/
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
This function loads all supervisors
that belong to a specific university
and supervise a specific course.
This is useful during student registration.
After selecting a university and a course,
the frontend can show only professors
that are available for this combination.
*/
export async function getSupervisorsByUniversityAndCourse(
    universityId: number,
    courseId: number
) {
    return prisma.supervisor.findMany({
      where: {

            /*
            The supervisor has to belong
            to the selected university.
            */
            universityId: universityId,

            /*
            "some" means that at least one
            connected course has to match
            the selected course ID.
            */
            courses: {
                some: {
                    id: courseId
                }
            }
        },

        /*
        Only these three values are returned.
        The frontend does not need information
        like the password hash here.
        */
        select: {
            id: true,
            name: true,
            chair: true
        }
    });
}