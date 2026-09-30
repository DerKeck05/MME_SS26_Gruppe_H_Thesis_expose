import { Router } from "express";

import {
    verifyPassword,
    hashPassword
} from "../utils/password.js";

import {
    getStudentByEmail,
    createStudent
} from "../database/repos/student-repo.js";

import {
    getSupervisorByEmail,
    createSupervisor
} from "../database/repos/supervisor-repo.js";


const router = Router();
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const INTERNAL_SERVER_ERROR = 500;


/* 
This route handles the login
for students and professors.
The role decides if the program searches
for a student or a professor.
*/
router.post(
    "/login",
    async (req, res) => {

        const {
            email,
            password,
            role
        } = req.body;


        /*
        If the selected role is student,
        the student is searched by email.
        */
        if (role == "student") {

            const student =
                await getStudentByEmail(
                    email
                );


            /*
            If no student with this email exists,
            the login is stopped.
            The same error message is used for
            a wrong email and a wrong password.
            */
            if (student == null) {

                return res.status(UNAUTHORIZED).json({
                    message:
                        "E-Mail oder Passwort falsch"
                });
            }

            /*
            The entered password is compared
            with the hashed password from the database.
            verifyPassword returns true
            if the password is correct.
            */
            const passwordCorrect =
                await verifyPassword(
                    password,
                    student.passwordHash
                );


            /*
            If the password is wrong,
            the login is stopped.
            */
            if (passwordCorrect == false) {

                return res.status(UNAUTHORIZED).json({
                    message:
                        "E-Mail oder Passwort falsch"
                });
            }


            /*
            If email and password are correct,
            the important user information
            is returned to the frontend.
            */
            return res.json({

                message:
                    "Login erfolgreich",

                role:
                    "student",

                user: {

                    id:
                        student.id,

                    name:
                        student.name,

                    email:
                        student.email
                }
            });
        }


        /*
        The professor login works in the same way
        as the student login 
        The only difference is that the supervisor
        repository is used.
        */
        if (role == "professor") {

            const supervisor =
                await getSupervisorByEmail(
                    email
                );


            /*
            If no professor with this email exists,
            the login is stopped.
            */
            if (supervisor == null) {

                return res.status(UNAUTHORIZED).json({
                    message:
                        "E-Mail oder Passwort falsch"
                });
            }


            /*
            Compare the entered password
            with the saved password hash.
            */
            const passwordCorrect =
                await verifyPassword(
                    password,
                    supervisor.passwordHash
                );


            if (passwordCorrect == false) {

                return res.status(UNAUTHORIZED).json({
                    message:
                        "E-Mail oder Passwort falsch"
                });
            }


            /*
            Successful professor login.
            Only the information needed
            by the frontend is returned.
            */
            return res.json({

                message:
                    "Login erfolgreich",

                role:
                    "professor",

                user: {

                    id:
                        supervisor.id,

                    name:
                        supervisor.name,

                    email:
                        supervisor.email
                }
            });
        }


        /*
        If the role is neither student
        nor professor, the request is invalid.
        */
        return res.status(BAD_REQUEST).json({
            message:
                "Ungültige Rolle"
        });
    }
);


/*
this route creates a new student account.
The frontend sends all information
that was selected during registration.
*/
router.post(
    "/register/student",
    async (req, res) => {

        const {
            name,
            email,
            password,
            universityId,
            courseId,
            supervisorId
        } = req.body;


        /*
        First I check if all required fields
        were sent by the frontend.
        If one value is missing,
        the registration is stopped.
        */
        if (
            !name ||
            !email ||
            !password ||
            !universityId ||
            !courseId ||
            !supervisorId
        ) {

            return res.status(BAD_REQUEST).json({
                message:
                    "Bitte alle Felder ausfüllen"
            });
        }


        /*
        IDs can arrive from the frontend
        as strings.
        Number converts them into numbers
        so they can be used by Prisma.
        */
        const universityIdNumber =
            Number(universityId);

        const courseIdNumber =
            Number(courseId);

        const supervisorIdNumber =
            Number(supervisorId);


        /*
        The converted IDs have to be integers.
        If one ID is invalid,
        the registration is stopped.
        */
        if (
            !Number.isInteger(universityIdNumber) ||
            !Number.isInteger(courseIdNumber) ||
            !Number.isInteger(supervisorIdNumber)
        ) {

            return res.status(BAD_REQUEST).json({
                message:
                    "Ungültige Auswahl"
            });
        }


        /*
        Check if the email is already used
        by another student.
        */
        const existingStudent =
            await getStudentByEmail(
                email
            );


        if (existingStudent != null) {

            return res.status(BAD_REQUEST).json({
                message:
                    "E-Mail ist bereits registriert"
            });
        }


        /*
        The password is never saved
        as normal readable text.
        hashPassword creates a secure hash
        that is saved in the database.
        */
        const passwordHash =
            await hashPassword(
                password
            );


        /*
        createStudent also checks if the selected
        course and supervisor really belong
        to the selected university.
        */
        try {

            await createStudent(
                name,
                email,
                passwordHash,
                universityIdNumber,
                courseIdNumber,
                supervisorIdNumber
            );


            return res.json({
                message:
                    "Student erfolgreich registriert"
            });


        } catch (error) {

            /*
            If createStudent throws a normal Error,
            its message is returned to the frontend.
            */
            if (error instanceof Error) {

                return res.status(BAD_REQUEST).json({
                    message:
                        error.message
                });
            }


            /*
            If an unknown error happens,
            a general error message is returned.
            */
            return res.status(INTERNAL_SERVER_ERROR).json({
                message:
                    "Registrierung fehlgeschlagen"
            });
        }
    }
);


/*
This route creates a new professor account.
*/
router.post(
    "/register/professor",
    async (req, res) => {

        const {
            name,
            email,
            password,
            universityId,
            chairId,
            courseIds
        } = req.body;


        /*
        Check if all required values exist.
        courseIds also has to be an array
        and at least one course has to be selected.
        */
        if (
            !name ||
            !email ||
            !password ||
            !universityId ||
            !chairId ||
            !Array.isArray(courseIds) ||
            courseIds.length == 0
        ) {

            return res.status(BAD_REQUEST).json({
                message:
                    "Bitte alle Felder ausfüllen"
            });
        }


        /*
        Convert university and chair ID
        into numbers.
        */
        const universityIdNumber =
            Number(universityId);

        const chairIdNumber =
            Number(chairId);


        /*
        courseIds contains multiple IDs.
        I create a new number array
        and convert every course ID separately.
        */
        const courseIdNumbers: number[] = [];


        for (const courseId of courseIds) {

            courseIdNumbers.push(
                Number(courseId)
            );
        }


        /*
        First I check universityId and chairId.
        */
        if (
            !Number.isInteger(universityIdNumber) ||
            !Number.isInteger(chairIdNumber)
        ) {

            return res.status(BAD_REQUEST).json({
                message:
                    "Ungültige Auswahl"
            });
        }


        /*
        Now every selected course ID
        is checked separately.
        */
        for (const courseId of courseIdNumbers) {

            if (!Number.isInteger(courseId)) {

                return res.status(BAD_REQUEST).json({
                    message:
                        "Ungültige Auswahl"
                });
            }
        }


        /*
        Check if a professor account
        with this email already exists.
        */
        const existingProfessor =
            await getSupervisorByEmail(
                email
            );


        if (existingProfessor != null) {

            return res.status(BAD_REQUEST).json({
                message:
                    "E-Mail ist bereits registriert"
            });
        }


        /*
        The professor password is also hashed
        before it is saved in the database.
        */
        const passwordHash =
            await hashPassword(
                password
            );


        /*
        createSupervisor checks if the chair
        belongs to the university and if
        all selected courses belong to the chair.
        */
        try {

            await createSupervisor(
                name,
                email,
                passwordHash,
                universityIdNumber,
                chairIdNumber,
                courseIdNumbers
            );


            return res.json({
                message:
                    "Professor erfolgreich registriert"
            });


        } catch (error) {

            if (error instanceof Error) {

                return res.status(BAD_REQUEST).json({
                    message:
                        error.message
                });
            }


            return res.status(INTERNAL_SERVER_ERROR).json({
                message:
                    "Registrierung fehlgeschlagen"
            });
        }
    }
);


export default router;