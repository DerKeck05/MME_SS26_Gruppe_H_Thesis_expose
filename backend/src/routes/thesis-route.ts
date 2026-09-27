import {Router} from "express";

import {
    createThesis,
    getThesisById
} from "../database/repos/thesis-repo.js";


const router = Router();

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


        const studentIdNumber = Number(studentId);
        const supervisorIdNumber = Number(supervisorId);


        /* IDs prüfen */
        if (
            isNaN(studentIdNumber) ||
            isNaN(supervisorIdNumber)
        ) {
            return res.status(400).json({
                message: "Student oder Professor ungültig"
            });
        }


        /* Titel prüfen */
        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {
            return res.status(400).json({
                message: "Titel fehlt"
            });
        }


        /* Datum prüfen */
        if (
            typeof startDate !== "string" ||
            typeof deadline !== "string"
        ) {
            return res.status(400).json({
                message: "Start- oder Abgabedatum fehlt"
            });
        }


        const parsedStartDate = new Date(startDate);
        const parsedDeadline = new Date(deadline);


        if (
            isNaN(parsedStartDate.getTime()) ||
            isNaN(parsedDeadline.getTime())
        ) {
            return res.status(400).json({
                message: "Ungültiges Datum"
            });
        }
        /* Thesis erstellen */
        const thesis = await createThesis(
            studentIdNumber,
            supervisorIdNumber,
            title.trim(),
            "",
            parsedStartDate,
            parsedDeadline
        );


        return res.status(201).json(thesis);

    } catch (error) {

        console.error(
            "Thesis konnte nicht erstellt werden:",
            error
        );

        return res.status(500).json({
            message: "Thesis konnte nicht erstellt werden"
        });
    }
});
/* Thesis anhand der ID laden */
router.get("/:thesisId", async (req, res) => {
    const thesisId = Number(req.params.thesisId);

    if (Number.isNaN(thesisId)) {
        res.status(400).json({
            error: "Ungültige Thesis-ID"
        });
        return;
    }

    try {
        const thesis = await getThesisById(thesisId);

        if (!thesis) {
            res.status(404).json({
                error: "Thesis nicht gefunden"
            });
            return;
        }

        res.status(200).json(thesis);
    } catch (error) {

        console.error(
            "Thesis konnte nicht geladen werden:",
            error
        );


        res.status(500).json({
            error: "Thesis konnte nicht geladen werden"
        });
    }
});
export default router;