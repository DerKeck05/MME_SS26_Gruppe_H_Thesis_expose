import express from "express";
import { getAllStudents } from "../database/repos/student-repo.js";



const router = express.Router();

router.get("/", async (req, res) => {
    const students = await getAllStudents();

    res.json(students);
});

export default router;