import { Router } from "express";

import {
    getAllUniversities,
    getCoursesByUniversityId,
    getChairsByUniversityId,
    getCoursesByUniversityAndChair
} from "../database/repos/university-repo.js";

import {
    getSupervisorsByUniversityAndCourse
} from "../database/repos/supervisor-repo.js";


const router = Router();


// HTTP status codes used in this route.
const BAD_REQUEST = 400;
const OK = 200;


/*
This route loads all universities
that are stored in the database.
No ID or other parameter is needed here.
The universities are already sorted
alphabetically inside the repository.
*/
router.get(
    "/",
    async (req, res) => {

        /*
        Load all universities
        from the database.
        */
        const universities =
            await getAllUniversities();


        /*
        Return the universities
        to the frontend.
        */
        return res.status(OK).json(
            universities
        );
    }
);


/*
This route loads all courses
that belong to one university.
*/
router.get(
    "/:id/courses",
    async (req, res) => {

        /*
        Number converts the university ID
        into a number.
        */
        const universityId =
            Number(req.params.id);


        /*
        Check if the university ID
        is a valid number.
        */
        if (Number.isNaN(universityId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid university ID"
            });
        }


        /*
        Load all courses
        that belong to this university.
        */
        const courses =
            await getCoursesByUniversityId(
                universityId
            );


        return res.status(OK).json(
            courses
        );
    }
);


/*
This route loads all chairs
that belong to one university.
The univrsityId is read from the URL.
*/
router.get(
    "/:universityId/chairs",
    async (req, res) => {

        const universityId =
            Number(req.params.universityId);


        /*
        Check if the university ID
        is a valid number.
        */
        if (Number.isNaN(universityId)) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid university ID"
            });
        }


        /*
        Load all chairs
        of the selected university.
        */
        const chairs =
            await getChairsByUniversityId(
                universityId
            );


        return res.status(OK).json(
            chairs
        );
    }
);


/*
This route loads only the courses
that belong to one specific chair.
Both the university ID
and the chair ID are part of the URL.
This is used during professor registration
after a chair was selected.
*/
router.get(
    "/:universityId/chairs/:chairId/courses",
    async (req, res) => {

        const universityId =
            Number(req.params.universityId);

        const chairId =
            Number(req.params.chairId);


        /*
        Both IDs have to be valid numbers.
        If one of them is invalid,
        the request is stopped.
        */
        if (
            Number.isNaN(universityId) ||
            Number.isNaN(chairId)
        ) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid university or chair ID"
            });
        }


        /*
        Load all courses that belong
        to the selected chair
        at the selected university.
        */
        const courses =
            await getCoursesByUniversityAndChair(
                universityId,
                chairId
            );


        return res.status(OK).json(
            courses
        );
    }
);


/*
This route loads all supervisors
that belong to the selected university
and supervise the selected course.
This is used during student registration.
After the student selects a university
and a course, only matching professors
should be shown.
*/
router.get(
    "/:universityId/courses/:courseId/supervisors",
    async (req, res) => {

        const universityId =
            Number(req.params.universityId);

        const courseId =
            Number(req.params.courseId);


        /*
        Both IDs have to be valid numbers.
        */
        if (
            Number.isNaN(universityId) ||
            Number.isNaN(courseId)
        ) {

            return res.status(BAD_REQUEST).json({
                error:
                    "Invalid university or course ID"
            });
        }


        /*
        Load all supervisors that match
        the selected university and course.
        */
        const supervisors =
            await getSupervisorsByUniversityAndCourse(
                universityId,
                courseId
            );


        return res.status(OK).json(
            supervisors
        );
    }
);


export default router;