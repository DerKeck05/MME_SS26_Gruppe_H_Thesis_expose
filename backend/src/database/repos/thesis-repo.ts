import { prisma } from "../lib/prisma.js";


/*
This function searches for one specific thesis.
The thesisId is used to identify
the thesis inside the database.
findUnique is used because every thesis
has its own unique ID.
If no thesis with this ID exists,
Prisma returns null.
*/
export async function getThesisById(
    thesisId: number
) {

    return prisma.thesis.findUnique({

        where: {
            id: thesisId
        }
    });
}


/*
This function loads all theses
that belong to one supervisor.
The supervisorId is used as a filter.
findMany is used because one supervisor
can supervise multiple theses.
*/
export async function getThesisBySupervisorId(
    supervisorId: number
) {

    return prisma.thesis.findMany({

        where: {
            supervisorId: supervisorId
        }
    });
}


/*
This function loads all theses
that belong to one student.
The studentId is used as a filter.
findMany is used because the function
currently returns a list of theses.
*/
export async function getThesesByStudentId(
    studentId: number
) {

    return prisma.thesis.findMany({

        where: {
            studentId: studentId
        }
    });
}


/*
This function creates a new thesis.
The studentId connects the thesis
to the correct student.
The supervisorId connects the thesis
to the professor who supervises it.
*/
export async function createThesis(
    studentId: number,
    supervisorId: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date
) {

    return prisma.thesis.create({
        /*
        The data object contains all values
        that should be saved for the new thesis.
        */
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