/*
The API URL comes from the environment variables.
This makes it possible to use a different backend URL
without changing the code in every API function.
*/
const API_URL =
    import.meta.env.VITE_API_URL;


/*
This interface describes one feedback entry
that comes from the backend.
*/
export interface FeedbackEntry {

    id: number;

    content: string;

    createdAt: string;

    updatedAt: string;

    chapterId: number;
}


/*
This function loads all feedback entries
that belong to one chapter.
*/
export async function getFeedbackEntries(
    chapterId: number
): Promise<FeedbackEntry[]> {

    /*
    Send a GET request to the backend.
    */
    const response =
        await fetch(
            `${API_URL}/api/feedback/chapter/${chapterId}`
        );


    /*
    If the backend returns an error status,
    the comments could not be loaded.
    */
    if (response.ok == false) {

        throw new Error(
            "Kommentare konnten nicht geladen werden"
        );
    }


    /*
    Convert the JSON response
    into JavaScript data and return it.
    */
    return response.json();
}


/*
This function sends a new comment
for one chapter to the backend.
The backend creates the feedback entry
and connects it to the selected chapter.
*/
export async function addFeedbackEntry(
    chapterId: number,
    content: string
): Promise<FeedbackEntry> {

    /*
    Send the comment to the backend.
    POST is used because
    a new feedback entry is created.
    */
    const response =
        await fetch(
            `${API_URL}/api/feedback/chapter/${chapterId}`,
            {

                method:
                    "POST",

                /*
                The request body contains JSON.
                */
                headers: {

                    "Content-Type":
                        "application/json"
                },

                /*
                Convert the comment into JSON
                before sending it to the backend.
                */
                body:
                    JSON.stringify({

                        content: content
                    })
            }
        );


    /*
    Convert the backend response
    into a JavaScript object.
    */
    const data =
        await response.json();


    /*
    If creating the comment failed,
    use the error message from the backend.
    If no message exists,
    a general error message is used.
    */
    if (response.ok == false) {

        throw new Error(

            data.error ||
            "Kommentar konnte nicht erstellt werden"
        );
    }


    /*
    Return the newly created feedback entry.
    */
    return data;
}