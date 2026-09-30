import { Router } from "express";

import {
    createFeedbackEntry,
    getFeedbackEntriesByChapterId
} from "../database/repos/feedback-entry-repo.js";
const router = Router();

// HTTP status codes used in this route.
const BAD_REQUEST = 400;
const CREATED = 201;
/*
This route loads all feedback entries
that belong to one specific chapter.
The chapterId is part of the URL.
*/
router.get(
    "/chapter/:chapterId",
    async (req, res) => {

        /*
        URL parameters are strings.
        Number converts the chapterId
        into a number so it can be used
        for the database query.
        */
        const chapterId =
            Number(req.params.chapterId);


        /*
        If the chapterId cannot be converted
        into a valid number, the request is stopped.
        */
        if (Number.isNaN(chapterId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid chapter ID"
            });
        }


        /*
        Load all feedback entries
        that belong to the selected chapter.
        */
        const feedbackEntries =
            await getFeedbackEntriesByChapterId(
                chapterId
            );


        /*
        Return the feedback entries
        to the frontend.
        */
        return res.json(
            feedbackEntries
        );
    }
);


/*
This route creates a new feedback entry
for one specific chapter.
The chapterId comes from the URL.
The content of the feedback
is sent inside the request body.
*/
router.post(
    "/chapter/:chapterId",
    async (req, res) => {

        const chapterId =
            Number(req.params.chapterId);


        /*
        Get the feedback content
        from the request body.
        */
        const {
            content
        } = req.body;


        /*
        Check if the chapterId
        is a valid number.
        */
        if (Number.isNaN(chapterId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid chapter ID"
            });
        }


        /*
        The feedback content has to be a string
        and it must not be empty.
        trim removes spaces at the beginning
        and end of the text.
        This also prevents feedback
        that only contains spaces.
        */
        if (
            typeof content !== "string" ||
            content.trim() == ""
        ) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Feedback content is required"
            });
        }


        /*
        Create the feedback entry
        and connect it to the selected chapter.
        trim is used again so unnecessary spaces
        are not saved in the database.
        */
        const feedback =
            await createFeedbackEntry(
                chapterId,
                content.trim()
            );


        /*
        201 means that a new resource
        was successfully created.
        */
        return res.status(CREATED).json(
            feedback
        );
    }
);


export default router;