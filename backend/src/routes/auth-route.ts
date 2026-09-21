import { Router } from "express";

/* Funktionen zum Passwort verschlüsseln und prüfen */
import {
    verifyPassword,
    hashPassword
} from "../utils/password.js";

/* Funktionen für Studenten aus der Datenbank */
import {
    getStudentByEmail,
    createStudent
} from "../database/repos/student-repo.js";

/* Funktionen für Professoren aus der Datenbank */
import {
    getSupervisorByEmail,
    createSupervisor
} from "../database/repos/supervisor-repo.js";


const router = Router();


/* =========================
   LOGIN
   ========================= */

router.post("/login", async (req, res) => {

    /* Daten die vom Frontend kommen */
    const { email, password, role } = req.body;


    /* =========================
       STUDENT LOGIN
       ========================= */

    if (role === "student") {

        /* Student mit der Email in der Datenbank suchen */
        const student = await getStudentByEmail(email);


        /* Wenn kein Student gefunden wurde */
        if (!student) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* Eingegebenes Passwort mit dem gespeicherten Hash vergleichen */
        const passwordCorrect = await verifyPassword(
            password,
            student.passwordHash
        );


        /* Wenn Passwort falsch ist */
        if (!passwordCorrect) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* Login erfolgreich */
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

    if (role === "professor") {

        /* Professor über seine Email suchen */
        const supervisor = await getSupervisorByEmail(email);


        /* Wenn kein Professor gefunden wurde */
        if (!supervisor) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* Passwort prüfen */
        const passwordCorrect = await verifyPassword(
            password,
            supervisor.passwordHash
        );


        /* Passwort stimmt nicht */
        if (!passwordCorrect) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* Login erfolgreich */
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


    /* Ungültige Rolle */
    return res.status(400).json({
        message: "Ungültige Rolle"
    });
});



/* =========================
   STUDENT REGISTRIERUNG
   ========================= */

router.post("/register/student", async (req, res) => {

    /* Daten vom Frontend auslesen */
    const {
        name,
        email,
        password,
        course
    } = req.body;


    /* Prüfen ob Email bereits existiert */
    const existingStudent = await getStudentByEmail(email);


    if (existingStudent) {
        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }


    /* Passwort hashen */
    const passwordHash = await hashPassword(password);


    /* Studenten erstellen */
    await createStudent(
        name,
        email,
        passwordHash,
        course
    );


    /* Erfolg zurückgeben */
    return res.json({
        message: "Student erfolgreich registriert"
    });
});



/* =========================
   PROFESSOR REGISTRIERUNG
   ========================= */

router.post("/register/professor", async (req, res) => {

    /* Daten vom Frontend auslesen */
    const {
        name,
        email,
        password,
        chair
    } = req.body;


    /* Prüfen ob Email bereits existiert */
    const existingProfessor = await getSupervisorByEmail(email);


    if (existingProfessor) {
        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }


    /* Passwort hashen */
    const passwordHash = await hashPassword(password);


    /* Professor erstellen */
    await createSupervisor(
        name,
        email,
        passwordHash,
        chair
    );


    /* Erfolg zurückgeben */
    return res.json({
        message: "Professor erfolgreich registriert"
    });
});


export default router;