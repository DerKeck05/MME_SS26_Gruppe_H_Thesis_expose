import { Router } from "express";

import {
    getFaqsBySupervisorId,
    createFaq,
    updateFaq,
    deleteFaq
} from "../database/repos/faq-repo.js";


const router = Router();


// HTTP status codes used in this route.
const BAD_REQUEST = 400;
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;


/*
This route loads all FAQ entries
that belong to one supervisor.
The supervisorId is part of the URL.
*/
router.get(
    "/supervisor/:supervisorId",
    async (req, res) => {

        /*
        Parameters from the URL are strings.
        Number converts the supervisorId
        into a number so it can be used
        by Prisma.
        */
        const supervisorId =
            Number(req.params.supervisorId);


        /*
        If the value cannot be converted
        into a valid number, the request is stopped.
        */
        if (Number.isNaN(supervisorId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid supervisor ID"
            });
        }


        /*
        Load all FAQs that belong
        to the selected supervisor.
        */
        const faqs =
            await getFaqsBySupervisorId(
                supervisorId
            );


        /*
        Return the FAQ list to the frontend.
        */
        return res.status(OK).json(
            faqs
        );
    }
);


/*
This route creates a new FAQ entry
for one supervisor.
The supervisorId is read from the URL.
The question and answer are sent
inside the request body.
*/
router.post(
    "/supervisor/:supervisorId",
    async (req, res) => {

        const supervisorId =
            Number(req.params.supervisorId);


        /*
        Check if the supervisor ID
        is a valid number.
        */
        if (Number.isNaN(supervisorId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid supervisor ID"
            });
        }


        /*
        Get question and answer
        from the request body.
        */
        const {
            question,
            answer
        } = req.body;


        /*
        Both values are required.
        If question or answer is missing,
        no FAQ is created.
        */
        if (!question || !answer) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Question and answer are required"
            });
        }


        /*
        Create the new FAQ
        and connect it to the supervisor.
        */
        const faq =
            await createFaq(
                question,
                answer,
                supervisorId
            );


        /*
        201 means that a new resource
        was successfully created.
        */
        return res.status(CREATED).json(
            faq
        );
    }
);


/*
This route updates an existing FAQ.
The FAQ ID is part of the URL.
*/
router.put(
    "/:id",
    async (req, res) => {

        const id =
            Number(req.params.id);


        /*
        Check if the FAQ ID
        is a valid number.
        */
        if (Number.isNaN(id)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid FAQ ID"
            });
        }


        const {
            question,
            answer
        } = req.body;


        /*
        Question and answer are always required
        because updateFaq expects both values.
        */
        if (!question || !answer) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Question and answer are required"
            });
        }


        /*
        Update the FAQ with the new values.
        */
        const faq =
            await updateFaq(
                id,
                question,
                answer
            );


        /*
        Return the updated FAQ
        to the frontend.
        */
        return res.status(OK).json(
            faq
        );
    }
);


/*
This route deletes one FAQ entry.
The FAQ ID is read from the URL.
*/
router.delete(
    "/:id",
    async (req, res) => {

        const id =
            Number(req.params.id);


        /*
        Check if the FAQ ID
        is a valid number.
        */
        if (Number.isNaN(id)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid FAQ ID"
            });
        }


        /*
        Delete the FAQ from the database.
        */
        await deleteFaq(
            id
        );


        /*
        204 means that the request was successful,
        but no response body is returned.
        */
        return res.status(NO_CONTENT).send();
    }
);


export default router;