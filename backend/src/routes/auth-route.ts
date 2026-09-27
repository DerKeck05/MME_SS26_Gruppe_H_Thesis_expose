import {Router} from "express";

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


/* =========================
   LOGIN
   ========================= */

router.post("/login", async (req, res) => {

    const {
        email,
        password,
        role
    } = req.body;


    /* =========================
       STUDENT LOGIN
       ========================= */

    if (role == "student") {

        const student =
            await getStudentByEmail(email);


        if (!student) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        const passwordCorrect =
            await verifyPassword(
                password,
                student.passwordHash
            );


        if (!passwordCorrect) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        return res.json({

            message: "Login erfolgreich",

            role: "student",

            user: {

                id: student.id,

                name: student.name,

                email: student.email
            }
        });
    }


    /* =========================
       PROFESSOR LOGIN
       ========================= */

    if (role == "professor") {

        const supervisor =
            await getSupervisorByEmail(email);


        if (!supervisor) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        const passwordCorrect =
            await verifyPassword(
                password,
                supervisor.passwordHash
            );


        if (!passwordCorrect) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        return res.json({

            message: "Login erfolgreich",

            role: "professor",

            user: {

                id: supervisor.id,

                name: supervisor.name,

                email: supervisor.email
            }
        });
    }


    return res.status(400).json({
        message: "Ungültige Rolle"
    });
});



/* =========================
   STUDENT REGISTRIERUNG
   ========================= */

router.post(
    "/register/student",
    async (req, res) => {

        const {
            name,
            email,
            password,
            course
        } = req.body;


        const existingStudent =
            await getStudentByEmail(email);


        if (existingStudent) {

            return res.status(400).json({
                message: "E-Mail ist bereits registriert"
            });
        }


        const passwordHash =
            await hashPassword(password);


        await createStudent(
            name,
            email,
            passwordHash,
            course
        );


        return res.json({
            message: "Student erfolgreich registriert"
        });
    }
);



/* =========================
   PROFESSOR REGISTRIERUNG
   ========================= */

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
         * Grundlegende Prüfung
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

            return res.status(400).json({
                message: "Bitte alle Felder ausfüllen"
            });
        }


        const universityIdNumber =
            Number(universityId);

        const chairIdNumber =
            Number(chairId);

        const courseIdNumbers =
            courseIds.map(
                (id) => Number(id)
            );


        /*
         * Prüfen, ob gültige IDs geschickt wurden
         */
        if (
            !Number.isInteger(universityIdNumber) ||
            !Number.isInteger(chairIdNumber) ||
            courseIdNumbers.some(
                (id) => !Number.isInteger(id)
            )
        ) {

            return res.status(400).json({
                message: "Ungültige Auswahl"
            });
        }


        const existingProfessor =
            await getSupervisorByEmail(email);


        if (existingProfessor) {

            return res.status(400).json({
                message: "E-Mail ist bereits registriert"
            });
        }


        const passwordHash =
            await hashPassword(password);


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
                message: "Professor erfolgreich registriert"
            });


        } catch (error) {

            if (error instanceof Error) {

                return res.status(400).json({
                    message: error.message
                });
            }


            return res.status(500).json({
                message: "Registrierung fehlgeschlagen"
            });
        }
    }
);


export default router;