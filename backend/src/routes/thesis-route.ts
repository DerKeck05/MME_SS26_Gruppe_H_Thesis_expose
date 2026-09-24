import express from "express";
import { createThesis } from "../database/repos/thesis-repo.js";


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

export default router;