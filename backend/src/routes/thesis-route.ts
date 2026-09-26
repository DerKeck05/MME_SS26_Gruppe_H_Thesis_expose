import express from "express";

import {
    createThesis,
    getThesisById,
    getThesesByStudentId
} from "../database/repos/thesis-repo.js";


const router = express.Router();


/* Neue Thesis erstellen */
router.post("/", async (req, res) => {
    try {
        const {
            studentId,
            supervisorId,
            title,
            startDate,
            deadline
        } = req.body;


        const startDateValue = new Date(startDate);
        const endDate = new Date(deadline);


        const thesis = await createThesis(
            studentId,
            supervisorId,
            title,
            "",
            startDateValue,
            endDate
        );


        return res.status(201).json(thesis);

    } catch (error) {
        console.error("Thesis konnte nicht erstellt werden:", error);

        return res.status(500).json({
            error: "Thesis konnte nicht erstellt werden"
        });
    }
});


/* Thesis eines Studenten laden */
router.get("/student/:studentId", async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);


        if (Number.isNaN(studentId)) {
            return res.status(400).json({
                error: "Ungültige Student-ID"
            });
        }


        const theses = await getThesesByStudentId(studentId);


        return res.status(200).json(theses);

    } catch (error) {
        console.error(
            "Thesis des Studenten konnte nicht geladen werden:",
            error
        );

        return res.status(500).json({
            error: "Thesis konnte nicht geladen werden"
        });
    }
});


/* Einzelne Thesis anhand der ID laden */
router.get("/:thesisId", async (req, res) => {
    try {
        const thesisId = Number(req.params.thesisId);


        if (Number.isNaN(thesisId)) {
            return res.status(400).json({
                error: "Ungültige Thesis-ID"
            });
        }


        const thesis = await getThesisById(thesisId);


        if (!thesis) {
            return res.status(404).json({
                error: "Thesis nicht gefunden"
            });
        }


        return res.status(200).json(thesis);

    } catch (error) {
        console.error(
            "Thesis konnte nicht geladen werden:",
            error
        );

        return res.status(500).json({
            error: "Thesis konnte nicht geladen werden"
        });
    }
});


export default router;