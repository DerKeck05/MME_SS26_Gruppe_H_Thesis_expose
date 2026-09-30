import { Router } from "express";

import {
    createThesis,
    getThesisById
} from "../database/repos/thesis-repo.js";


const router = Router();


// HTTP status codes used in this route.
const BAD_REQUEST = 400;
const OK = 200;
const CREATED = 201;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;


/*
This route creates a new thesis.
Before the thesis is created,
all important values are checked.
*/
router.post(
    "/",
    async (req, res) => {

        try {

            /*
            Get all values from the request body.
            */
            const {
                studentId,
                supervisorId,
                title,
                startDate,
                deadline
            } = req.body;


            /*
            IDs can arrive from the frontend
            as strings.
            Number converts them into numbers
            so they can be used by Prisma.
            */
            const studentIdNumber =
                Number(studentId);

            const supervisorIdNumber =
                Number(supervisorId);


            /*
            Both IDs have to be valid numbers.
            If one of them is not a number,
            the request is stopped.
            */
            if (
                Number.isNaN(studentIdNumber) ||
                Number.isNaN(supervisorIdNumber)
            ) {

                return res.status(BAD_REQUEST).json({
                    message:
                        "Student oder Professor ungültig"
                });
            }


            /*
            The title has to be a string
            and it must not be empty.
            trim removes spaces from the beginning
            and end of the title.
            This also prevents titles
            that only contain spaces.
            */
            if (
                typeof title !== "string" ||
                title.trim() == ""
            ) {

                return res.status(BAD_REQUEST).json({
                    message:
                        "Titel fehlt"
                });
            }


            /*
            The start date and deadline
            are sent by the frontend as strings.
            Both values are required.
            */
            if (
                typeof startDate !== "string" ||
                typeof deadline !== "string"
            ) {

                return res.status(BAD_REQUEST).json({
                    message:
                        "Start- oder Abgabedatum fehlt"
                });
            }


            /*
            The date strings are converted
            into JavaScript Date objects.
            createThesis expects Date objects
            for startDate and endDate.
            */
            const parsedStartDate =
                new Date(startDate);

            const parsedDeadline =
                new Date(deadline);


            /*
            getTime returns the timestamp
            of a valid date.
            If the date is invalid,
            getTime returns NaN.
            */
            if (
                Number.isNaN(parsedStartDate.getTime()) ||
                Number.isNaN(parsedDeadline.getTime())
            ) {

                return res.status(BAD_REQUEST).json({
                    message:
                        "Ungültiges Datum"
                });
            }


            /*
            After all values were checked,
            the thesis can be saved in the database
            The description is currently an empty string
            because no description is entered
            when the thesis is created.
            title.trim() removes unnecessary spaces
            before the title is saved.
            */
            const thesis =
                await createThesis(
                    studentIdNumber,
                    supervisorIdNumber,
                    title.trim(),
                    "",
                    parsedStartDate,
                    parsedDeadline
                );


            /*
            201 means that a new resource
            was successfully created.
            */
            return res.status(CREATED).json(
                thesis
            );


        } catch (error) {

            /*
            If an unexpected error happens
            while creating the thesis,
            it is written into the backend console.
            */
            console.error(
                "Thesis konnte nicht erstellt werden:",
                error
            );


            /*
            500 means that an internal server error occurred.
            */
            return res.status(INTERNAL_SERVER_ERROR).json({
                message:
                    "Thesis konnte nicht erstellt werden"
            });
        }
    }
);


/*
This route loads one specific thesis.
The thesisId is part of the URL.
*/
router.get(
    "/:thesisId",
    async (req, res) => {

        /*
        URL parameters are strings.
        Number converts the thesisId
        into a number.
        */
        const thesisId =
            Number(req.params.thesisId);


        /*
        Check if the thesis ID
        is a valid number.
        */
        if (Number.isNaN(thesisId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Ungültige Thesis-ID"
            });
        }


        try {

            /*
            Load the thesis
            from the database.
            */
            const thesis =
                await getThesisById(
                    thesisId
                );


            /*
            If no thesis with this ID exists,
            the database returns null.
            404 means that the requested resource
            could not be found.
            */
            if (thesis == null) {

                return res.status(NOT_FOUND).json({
                    error:
                        "Thesis nicht gefunden"
                });
            }


            /*
            If the thesis was found,
            return it to the frontend.
            200 means that the request
            was successful.
            */
            return res.status(OK).json(
                thesis
            );


        } catch (error) {

            /*
            If something unexpected happens
            while loading the thesis,
            the error is written into the console.
            */
            console.error(
                "Thesis konnte nicht geladen werden:",
                error
            );


            return res.status(INTERNAL_SERVER_ERROR).json({
                error:
                    "Thesis konnte nicht geladen werden"
            });
        }
    }
);


export default router;