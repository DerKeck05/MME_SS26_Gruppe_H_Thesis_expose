import { prisma } from "../lib/prisma.js";


/*
This function creates a new FAQ entry in the database
It receives:the question, the answer,the ID of the supervisor
The supervisorId connects the FAQ to the supervisor who created it.
prisma.faq.create creates the new entry
and returns the created FAQ.
*/
export async function createFaq(
    question: string,
    answer: string,
    supervisorId: number
) {

    return prisma.faq.create({

        /*
        The data object contains all values
        that should be saved in the database.
        */
        data: {
            question: question,
            answer: answer,
            supervisorId: supervisorId
        }
    });
}


/*
This function searches for one specific FAQ.
The faqId is used to identify the FAQ inside the database.
findUnique is used because every FAQ has its own unique ID.
If no FAQ with this ID exists, Prisma returns null.
*/
export async function getFaqById(
    faqId: number
) {

    return prisma.faq.findUnique({

        where: {
            id: faqId
        }
    });
}


/*
This function loads all FAQ entries
that belong to one supervisor.
The supervisorId is used as a filter.
findMany is used because one supervisor
can have more than one FAQ entry.
*/
export async function getFaqsBySupervisorId(
    supervisorId: number
) {

    return prisma.faq.findMany({

        where: {
            supervisorId: supervisorId
        }
    });
}


/*
This function updates an existing FAQ entry.
The faqId is used to find the correct FAQ.
The complete question and answer are always
sent to this function. Even if only one value was changed,
the unchanged value is sent again.
Because of this, question and answer
do not have to be optional.
*/
export async function updateFaq(
    faqId: number,
    question: string,
    answer: string
) {

    return prisma.faq.update({

        /*
        The ID tells Prisma which FAQ
        should be updated.
        */
        where: {
            id: faqId
        },

        /*
        The question and answer are replaced
        with the values received by the function.
        */
        data: {
            question: question,
            answer: answer
        }
    });
}


/*
This function deletes one FAQ entry
from the database.
The faqId is used to find the FAQ
that should be deleted.
prisma.faq.delete removes the entry
and returns the deleted FAQ.
*/
export async function deleteFaq(
    faqId: number
) {

    return prisma.faq.delete({

        where: {
            id: faqId
        }
    });
}