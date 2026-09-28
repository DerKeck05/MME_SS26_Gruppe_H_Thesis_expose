import express from "express";

import {
    getAllUniversities,
    getCoursesByUniversityId,
    getChairsByUniversityId,
    getCoursesByUniversityAndChair
} from "../database/repos/university-repo.js";

import {
    getSupervisorsByUniversityAndCourse
} from "../database/repos/supervisor-repo.js";


const router = express.Router();


/*
 * Alle Hochschulen
 */
router.get("/", async (req, res) => {

    const universities =
        await getAllUniversities();

    res.json(universities);
});


/*
 * Alle Studiengänge einer Hochschule
 */
router.get("/:id/courses", async (req, res) => {

    const universityId =
        Number(req.params.id);


    const courses =
        await getCoursesByUniversityId(
            universityId
        );


    res.json(courses);
});


/*
 * Alle Lehrstühle einer Hochschule
 */
router.get(
    "/:universityId/chairs",
    async (req, res) => {

        const universityId =
            Number(req.params.universityId);


        const chairs =
            await getChairsByUniversityId(
                universityId
            );


        res.json(chairs);
    }
);


/*
 * Nur die Studiengänge,
 * die einem Lehrstuhl zugeordnet sind
 */
router.get(
    "/:universityId/chairs/:chairId/courses",
    async (req, res) => {

        const universityId =
            Number(req.params.universityId);

        const chairId =
            Number(req.params.chairId);


        const courses =
            await getCoursesByUniversityAndChair(
                universityId,
                chairId
            );


        res.json(courses);
    }
);


/*
 * Professoren für Hochschule + Studiengang
 *
 * Wird später von der Studenten-
 * Registrierung benutzt.
 */
router.get(
    "/:universityId/courses/:courseId/supervisors",
    async (req, res) => {

        const universityId =
            Number(req.params.universityId);

        const courseId =
            Number(req.params.courseId);


        const supervisors =
            await getSupervisorsByUniversityAndCourse(
                universityId,
                courseId
            );


        res.json(supervisors);
    }
);


export default router;