import express from "express";
import {
    getAllStudents,
    getStudentsBySupervisorId
} from "../database/repos/student-repo.js";



const router = express.Router();

router.get("/", async (req, res) => {
    const students = await getAllStudents();

    res.json(students);
});
router.get("/supervisor/:id", async (req, res) => {
    const supervisorId = Number(req.params.id);

    const students = await getStudentsBySupervisorId(supervisorId);

    res.json(students);
});

export default router;