import express from "express";
import {
    getAllUniversities,
    getCoursesByUniversityId
} from "../database/repos/university-repo.js";
import { getSupervisorsByUniversityAndCourse } from "../database/repos/supervisor-repo.js";

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
router.get("/:universityId/courses/:courseId/supervisors", async (req, res) => {
    const universityId = Number(req.params.universityId);
    const courseId = Number(req.params.courseId);

    const supervisors = await getSupervisorsByUniversityAndCourse(
        universityId,
        courseId
    );

    res.json(supervisors);
});

export default router;