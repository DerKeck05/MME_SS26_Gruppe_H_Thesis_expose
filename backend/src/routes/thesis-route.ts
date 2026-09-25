import {
    createThesis,
    getThesisById
} from "../database/repos/thesis-repo.js";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    const { studentId, supervisorId, title, deadline } = req.body;
    const startDate = new Date();
    const endDate = new Date(deadline);
    const thesis = await createThesis(
        studentId,
        supervisorId,
        title,
        "",
        startDate,
        endDate

    );
    res.status(201).json(thesis);
});
router.get("/:id", async (req, res) => {

    const thesisId = Number(req.params.id);

    const thesis = await getThesisById(thesisId);

    res.json(thesis);
});
export default router;