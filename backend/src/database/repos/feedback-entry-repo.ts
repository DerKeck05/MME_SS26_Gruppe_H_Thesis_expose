import { prisma } from "../lib/prisma.js";


/*
This function creates a new feedback entry
for one specific chapter.
It receives the ID of the chapter and the content of the feedback
The chapterId connects the feedback entry to the correct chapter.
prisma.feedbackEntry.create creates the new
entry in the database and returns it.
*/
export async function createFeedbackEntry(
    chapterId: number,
    content: string
) {

    return prisma.feedbackEntry.create({

        /*
        The data object contains the values
        that should be saved in the database.
        */
        data: {
            chapterId: chapterId,
            content: content
        }
    });
}


/*
This function loads all feedback entries
that belong to one chapter.
The chapterId is used as a filter.
findMany is used because one chapter
can have more than one feedback entry.
*/
export async function getFeedbackEntriesByChapterId(
    chapterId: number
) {

    return prisma.feedbackEntry.findMany({

        where: {
            chapterId: chapterId
        }
    });
}


/*
This function searches for one specific
feedback entry in the database.
The feedbackEntryId is used to identify
the correct feedback entry.
findUnique is used because every feedback entry
has its own unique ID.
If no entry with this ID exists,
Prisma returns null.
*/
export async function getFeedbackEntryById(
    feedbackEntryId: number
) {

    return prisma.feedbackEntry.findUnique({

        where: {
            id: feedbackEntryId
        }
    });
}


/*
This function updates an existing feedback entry.
The feedbackEntryId is used to find
the correct feedback entry.
The complete new content is always sent
to this function.
Because of this, content does not have
to be optional.
*/
export async function updateFeedbackEntry(
    feedbackEntryId: number,
    content: string
) {

    return prisma.feedbackEntry.update({

        /*
        The ID tells Prisma which feedback entry
        should be updated.
        */
        where: {
            id: feedbackEntryId
        },

        /*
        The old content is replaced
        with the new content.
        */
        data: {
            content: content
        }
    });
}


/*
This function deletes one feedback entry
from the database.
fedbackEntryId is used to find
the entry that should be deleted.
prisma.feedbackEntry.delete removes the entry
and returns the deleted feedback object.
*/
export async function deleteFeedbackEntry(
    feedbackEntryId: number
) {

    return prisma.feedbackEntry.delete({

        where: {
            id: feedbackEntryId
        }
    });
}