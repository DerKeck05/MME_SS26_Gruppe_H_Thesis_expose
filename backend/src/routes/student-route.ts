import express from "express";

import {
    getStudentById,
    getStudentsBySupervisorId,
    updateStudent
} from "../database/repos/student-repo.js";

const router = express.Router();


/* Studenten eines Professors laden */
router.get("/supervisor/:id", async (req, res) => {
    try {
        const supervisorId = Number(req.params.id);

        if (isNaN(supervisorId)) {
            return res.status(400).json({
                message: "Ungültige Professor-ID"
            });
        }

        const students =
            await getStudentsBySupervisorId(supervisorId);

        return res.status(200).json(students);

    } catch (error) {
        console.error(
            "Studenten konnten nicht geladen werden:",
            error
        );

        return res.status(500).json({
            message: "Studenten konnten nicht geladen werden"
        });
    }
});


/* Student anhand der ID laden */
router.get("/:studentId", async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);

        if (isNaN(studentId)) {
            return res.status(400).json({
                message: "Ungültige Student-ID"
            });
        }

        const student = await getStudentById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student nicht gefunden"
            });
        }

        return res.status(200).json(student);

    } catch (error) {
        console.error(
            "Fehler beim Laden des Studenten:",
            error
        );

        return res.status(500).json({
            message: "Student konnte nicht geladen werden"
        });
    }
});


/* Student bearbeiten */
router.put("/:studentId", async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);
        const {name, email, course} = req.body;

        if (isNaN(studentId)) {
            return res.status(400).json({
                message: "Ungültige Studenten-ID"
            });
        }

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof course !== "string"
        ) {
            return res.status(400).json({
                message: "Name, E-Mail und Kurs sind erforderlich"
            });
        }

        const student = await updateStudent(
            studentId,
            name.trim(),
            email.trim(),
            course.trim()
        );

        return res.json(student);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Student konnte nicht aktualisiert werden"
        });
    }
});


export default router;