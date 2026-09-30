import { prisma } from "../lib/prisma.js";


/*
This function searches for one student
with a specific ID.
findUnique is used because every student
has a unique ID.
The thesis is loaded together with the student
because some pages need to know if the student
already has a thesis.
*/
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


/*
This function searches for students
with a specific name.
findMany is used because multiple students
can have the same name.
The function therefore returns a list
of matching students.
*/
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
This function loads all students
that belong to one supervisor.
The supervisorId is used as a filter.
The thesis is loaded together with every student
because the professor dashboard needs to know
if a student already has a thesis or is still waiting.
The students are sorted alphabetically by name.
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
            // asc for sorting
            name: "asc"
        }
    });
}


/*
This function searches for a student
with a specific email address.
findUnique is used because the email
is unique for every student.
This function can for example be used
during login or registration.
*/
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
This function creates a new student.
Before the student gets created,
the selected course and supervisor are checked.
The function receives:
- name
- email
- hashed password
- university ID
- course ID
- supervisor ID
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
  
    First I check if the selected course exists
    and belongs to the selected university.

    findFirst searches for a course
    where both conditions are true:
    - the course has the selected ID
    - the course belongs to the selected university
    */
    const selectedCourse =
        await prisma.course.findFirst({

            where: {
                id: courseId,
                universityId: universityId
            }
        });


    /*
    If no matching course was found,
    the registration should not continue.
    */
    if (selectedCourse == null) {

        throw new Error(
            "Studiengang wurde nicht gefunden"
        );
    }


    /*
    Now I check if the selected supervisor
    is allowed for this registration.
    The supervisor has to:
    - have the selected ID
    - belong to the selected university
    - supervise the selected course
    */
    const selectedSupervisor =
        await prisma.supervisor.findFirst({

            where: {

                id: supervisorId,

                universityId: universityId,

                /*
                some means that at least one
                connected course must have
                the selected course ID.
                */
                courses: {

                    some: {
                        id: courseId
                    }
                }
            }
        });


    /*
    If the professor does not match
    the selected university and course,
    the student cannot be registered.
    */
    if (selectedSupervisor == null) {

        throw new Error(
            "Professor gehört nicht zu diesem Studiengang"
        );
    }


    /*
    After the course and supervisor were checked,
    the new student can be saved in the database.
    The course name is also saved as text
    because existing parts of the frontend
    still use this field.
    */
    return prisma.student.create({

        data: {

            name: name,

            email: email,

            passwordHash: passwordHash,

            course: selectedCourse.name,

            universityId: universityId,

            courseId: courseId,

            supervisorId: supervisorId
        }
    });
}


/*
This function assigns a supervisor
to an existing student.
The student is found by the student ID.
The supervisorId inside the student
is then replaced with the new supervisor ID.
*/
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


/*
This function updates the basic information
of an existing student.
The complete name, email and course
are always sent to the function.
Even if only one value was changed,
the other unchanged values are sent again.
Because of this, the parameters
do not have to be optional.
*/
export async function updateStudent(
    studentId: number,
    name: string,
    email: string,
    course: string
) {

    return prisma.student.update({

        /*
        The studentId tells Prisma
        which student should be updated.
        */
        where: {
            id: studentId
        },

        /*
        The old values are replaced
        with the values received by the function.
        */
        data: {
            name: name,
            email: email,
            course: course
        }
    });
}


/*
This function checks if a supervisor
is assigned to the student.
Only the supervisorId is loaded
because no other student information
is needed for this check.
*/
export async function hasSupervisor(
    id: number
) {

    const student =
        await prisma.student.findUnique({

            where: {
                id: id
            },

            /*
            select is used because I only need
            the supervisorId from the student.
            */
            select: {
                supervisorId: true
            }
        });


    /*
    If the student was not found,
    the function returns false.
    */
    if (student == null) {
        return false;
    }


    /*
    If supervisorId is null,
    no supervisor is assigned.
    */
    if (student.supervisorId == null) {
        return false;
    }


    /*
    If the student exists and supervisorId
    contains a value, the student has a supervisor.
    */
    return true;
}


/*
This function deletes one student
from the database.
The studentId is used to find
the student that should be removed.
*/
export async function deleteStudent(
    studentId: number
) {

    return prisma.student.delete({

        where: {
            id: studentId
        }
    });
}