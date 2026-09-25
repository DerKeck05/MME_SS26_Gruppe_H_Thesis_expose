import express from "express";
import {
    getAllUniversities,
    getCoursesByUniversityId
} from "../database/repos/university-repo.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const universities = await getAllUniversities();
    res.json(universities);
});

router.get("/:id/courses", async (req, res) => {
    const universityId = Number(req.params.id);
    const courses = await getCoursesByUniversityId(universityId);

    res.json(courses);
});

export default router;