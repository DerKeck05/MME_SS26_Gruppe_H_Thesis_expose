import express from "express";

import {
    getStudentById,
    getStudentsBySupervisorId,
    updateStudent
} from "../database/repos/student-repo.js";


const router = express.Router();


/*
STUDENTEN EINES PROFESSORS LADEN

This route loads all students
that belong to one specific supervisor.

The supervisor ID is part of the URL.

Example:

/api/student/supervisor/5

In this example the supervisorId is 5.
*/
router.get(
    "/supervisor/:id",
    async (req, res) => {

        try {

            /*
            URL parameters are strings.

            Number converts the supervisor ID
            into a number so it can be used
            for the database query.
            */
            const supervisorId =
                Number(req.params.id);


            /*
            Check if the supervisor ID
            is a valid number.
            */
            if (Number.isNaN(supervisorId)) {

                return res.status(400).json({
                    message:
                        "Ungültige Professor-ID"
                });
            }


            /*
            Load all students
            that belong to this supervisor.
            */
            const students =
                await getStudentsBySupervisorId(
                    supervisorId
                );


            /*
            Return the students
            to the frontend.
            */
            return res.status(200).json(
                students
            );

        } catch (error) {

            console.error(
                "Studenten konnten nicht geladen werden:",
                error
            );


            /*
            Return a server error
            if loading the students failed.
            */
            return res.status(500).json({
                message:
                    "Studenten konnten nicht geladen werden"
            });
        }
    }
);


/*
STUDENT ANHAND DER ID LADEN

This route loads one specific student
using the student's ID.

The student ID is part of the URL.

Example:

/api/student/2

In this example the studentId is 2.
*/
router.get(
    "/:studentId",
    async (req, res) => {

        try {

            /*
            URL parameters are strings.

            Number converts the student ID
            into a number so it can be used
            for the database query.
            */
            const studentId =
                Number(req.params.studentId);


            /*
            Check if the student ID
            is a valid number.
            */
            if (Number.isNaN(studentId)) {

                return res.status(400).json({
                    message:
                        "Ungültige Student-ID"
                });
            }


            /*
            Load the student
            from the database.
            */
            const student =
                await getStudentById(
                    studentId
                );


            /*
            If no student was found,
            return a 404 error.
            */
            if (!student) {

                return res.status(404).json({
                    message:
                        "Student nicht gefunden"
                });
            }


            /*
            Return the student
            to the frontend.
            */
            return res.status(200).json(
                student
            );

        } catch (error) {

            console.error(
                "Fehler beim Laden des Studenten:",
                error
            );


            /*
            Return a server error
            if loading the student failed.
            */
            return res.status(500).json({
                message:
                    "Student konnte nicht geladen werden"
            });
        }
    }
);


/*
STUDENT BEARBEITEN

This route updates the data
of one specific student.

The student ID is part of the URL.

The new student data is sent
inside the request body.

Example:

PUT /api/student/2
*/
router.put(
    "/:studentId",
    async (req, res) => {

        try {

            /*
            Convert the student ID
            from the URL into a number.
            */
            const studentId =
                Number(req.params.studentId);


            /*
            Get the updated student data
            from the request body.
            */
            const {
                name,
                email,
                course
            } = req.body;


            /*
            Check if the student ID
            is a valid number.
            */
            if (Number.isNaN(studentId)) {

                return res.status(400).json({
                    message:
                        "Ungültige Studenten-ID"
                });
            }


            /*
            Check if all required fields
            are strings and are not empty.
            */
            if (
                typeof name !== "string" ||
                typeof email !== "string" ||
                typeof course !== "string" ||
                name.trim() === "" ||
                email.trim() === "" ||
                course.trim() === ""
            ) {

                return res.status(400).json({
                    message:
                        "Name, E-Mail und Kurs sind erforderlich"
                });
            }


            /*
            Update the student
            in the database.

            trim removes unnecessary spaces
            at the beginning and end.
            */
            const student =
                await updateStudent(
                    studentId,
                    name.trim(),
                    email.trim(),
                    course.trim()
                );


            /*
            Return the updated student
            to the frontend.
            */
            return res.json(
                student
            );

        } catch (error) {

            console.error(
                "Fehler beim Aktualisieren des Studenten:",
                error
            );


            /*
            Return a server error
            if updating the student failed.
            */
            return res.status(500).json({
                message:
                    "Student konnte nicht aktualisiert werden"
            });
        }
    }
);


export default router;