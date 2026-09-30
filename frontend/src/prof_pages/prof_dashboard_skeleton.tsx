import { useEffect, useState} from "react";
import {  Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import ProfSidebar from "./prof-sidebar.tsx";
import "../student_pages/student-dashboard-stylesheet.css";
import "../app_theme/modal-stylesheet.css";
import "./prof-dashboard-stylesheet.css";


const API_URL =
    import.meta.env.VITE_API_URL;


/*
This type contains the information
that is needed for the dashboard header.
Only the student name
and thesis title are needed here.
*/
type ThesisInfo = {
    studentName: string;
    thesisTitle: string;
};


/*
This type describes the thesis information
that comes from the backend.
*/
type Thesis = {
    id: number;
    title: string;
};


/*
This type describes the student data
that is needed on this page.
A student can have a thesis
or no thesis yet.
*/
type Student = {
    name: string;
    thesis: Thesis | null;
};


function ProfDashboardSkeleton() {

    /*
    location is used to check
    which professor page is currently open.
    navigate is used for the back button.
    id contains the thesis ID
    from the URL.
    */
    const location =
        useLocation();

    const navigate =
        useNavigate();

    const { id } =
        useParams();


    /*
    Stores the student name
    and thesis title for the header.
    At the beginning no thesis
    information is loaded.
    */
    const [thesisInfo, setThesisInfo] =
        useState<ThesisInfo | null>(null);

    /*
    Whenever the thesis ID changes,
    the student data of the professor
    is loaded again.
    The student with the matching thesis
    is then searched.
    */
    useEffect(() => {

        async function loadThesisInfo() {

            const supervisorId =
                localStorage.getItem(
                    "supervisorId"
                );


            /*
            Without a professor ID
            or thesis ID there is nothing
            to load.
            */
            if (
                supervisorId == null ||
                id == null
            ) {

                return;
            }


            const thesisId =
                Number(id);


            /*
            Make sure the thesis ID
            from the URL is a valid number.
            */
            if (
                Number.isNaN(thesisId)
            ) {

                return;
            }


            try {

                /*
                Load all students
                assigned to this professor.
                */
                const response =
                    await fetch(
                        `${API_URL}/api/students/supervisor/${supervisorId}`
                    );


                if (
                    response.ok == false
                ) {

                    throw new Error(
                        "Studenten konnten nicht geladen werden"
                    );
                }


                const students: Student[] =
                    await response.json();


                /*
                Search for the student
                whose thesis ID matches
                the ID from the URL.
                */
                let matchingStudent: Student | null =
                    null;


                for (const student of students) {

                    if (
                        student.thesis != null &&
                        student.thesis.id == thesisId
                    ) {

                        matchingStudent =
                            student;

                        break;
                    }
                }


                /*
                If no matching student
                or thesis was found,
                nothing has to be displayed.
                */
                if (
                    matchingStudent == null ||
                    matchingStudent.thesis == null
                ) {

                    return;
                }


                /*
                Store the information
                needed for the dashboard header.
                */
                setThesisInfo({
                    studentName:
                        matchingStudent.name,

                    thesisTitle:
                        matchingStudent.thesis.title
                });


            } catch (error) {

                /*
                This is not a debug log.
                It keeps the real loading error
                visible in the developer console.
                */
                console.error(
                    "Fehler beim Laden der Thesis-Informationen:",
                    error
                );
            }
        }


        loadThesisInfo();

    }, [id]);


    /*
    The normal title is
    Professor Dashboard
    On a thesis detail page
    the thesis title is shown instead.
    */
    let pageTitle =
        "Professor Dashboard";


    if (
        location.pathname.includes(
            "/thesis/"
        )
    ) {

        if (
            thesisInfo != null &&
            thesisInfo.thesisTitle != ""
        ) {

            pageTitle =
                thesisInfo.thesisTitle;

        } else {

            pageTitle =
                "Thesis Details";
        }
    }


    return (

        <div
            className="student-dashboard professor-dashboard"
        >

            {/*
            Contains the back button,
            page title and student name.
            */}
            <header
                className="student-dashboard-header professor-dashboard-header"
            >

                <button
                    type="button"
                    className="prof-back-button"
                    onClick={() =>
                        navigate("/professor")
                    }
                >
                    Zurück
                </button>


                <div className="dashboard-title-block">

                    <h1>
                        {pageTitle}
                    </h1>


                    {
                        thesisInfo != null && (

                            <p className="dashboard-subtitle">
                                {thesisInfo.studentName}
                            </p>
                        )
                    }

                </div>


                {/*
                Empty element keeps the title block
                positioned correctly in the header.
                */}
                <div className="profile-button"></div>

            </header>


            {/*
            The sidebar stays on the left
            Outlet displays the professor page
            selected by the current route.
            */}
            <div className="student-dashboard-body">

                <ProfSidebar />


                <main className="professor-main-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}


export default ProfDashboardSkeleton;