import {
    createThesis,
    getThesisById,
    getThesesByStudentId
} from "../database/repos/thesis-repo.js";
import express from "express";


const router = express.Router();

router.post("/", async (req, res) => {
    const { studentId, supervisorId, title, startDate, deadline } = req.body;

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

    res.status(201).json(thesis);
});
router.get("/:id", async (req, res) => {

    const thesisId = Number(req.params.id);

    const thesis = await getThesisById(thesisId);

    res.json(thesis);
});
router.get("/student/:studentId", async (req, res) => {
    const studentId = Number(req.params.studentId);

    const theses = await getThesesByStudentId(studentId);

    res.json(theses);
});
export default router;