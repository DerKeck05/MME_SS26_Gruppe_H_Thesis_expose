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

        const student = await getStudentByEmail(email);

        if (!student) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        const passwordCorrect = await verifyPassword(
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

        const supervisor = await getSupervisorByEmail(email);

        if (!supervisor) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        const passwordCorrect = await verifyPassword(
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

router.post("/register/student", async (req, res) => {

    const {
        name,
        email,
        password,
        course
    } = req.body;


    const existingStudent = await getStudentByEmail(email);


    if (existingStudent) {
        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }


    const passwordHash = await hashPassword(password);


    await createStudent(
        name,
        email,
        passwordHash,
        course
    );


    return res.json({
        message: "Student erfolgreich registriert"
    });
});


/* =========================
   PROFESSOR REGISTRIERUNG
   ========================= */

router.post("/register/professor", async (req, res) => {

    const {
        name,
        email,
        password,
        chair,
        universityId,
        courseIds
    } = req.body;


    if (
        !name ||
        !email ||
        !password ||
        !chair ||
        !universityId ||
        !Array.isArray(courseIds) ||
        courseIds.length == 0
    ) {
        return res.status(400).json({
            message: "Bitte alle Felder ausfüllen"
        });
    }


    const existingProfessor =
        await getSupervisorByEmail(email);


    if (existingProfessor) {
        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }


    const passwordHash = await hashPassword(password);


    await createSupervisor(
        name,
        email,
        passwordHash,
        chair,
        Number(universityId),
        courseIds.map((id) => Number(id))
    );


    return res.json({
        message: "Professor erfolgreich registriert"
    });
});


export default router;