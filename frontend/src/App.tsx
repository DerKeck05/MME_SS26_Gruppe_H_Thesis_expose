import {Route,Routes,useParams} from "react-router-dom";
import OutlinePage from "./student_pages/outline_pages/outline-page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import CalendarPage from "./student_pages/calendar_pages/calendar-page.tsx";
import ErrorPage from "./student_pages/error-page.tsx";
import LoginPage from "./login/login_page.tsx";
import RegisterPage from "./login/register_page.tsx";
import RegisterStudentPage from "./login/register_student.tsx";
import RegisterProfessorPage from "./login/register_prof.tsx";
import StudentProvider, {useStudent} from "./student_pages/route_handling/student-provider.tsx";
import StudentLayout from "./student_pages/route_handling/student-layout.tsx";
import ProfStartpage from "./prof_pages/prof_starpage.tsx";
import ProfCalendarPage from "./prof_pages/prof-calender-page.tsx";
import ProfDashboardSkeleton from "./prof_pages/prof_dashboard_skeleton.tsx";
import ThesisDetail from "./prof_pages/thesis_detail.tsx";
import FaqPage from "./shared_pages/faq-page.tsx";


/*
The professor ID is stored
inside localStorage after login.
It is passed to the shared FAQ page
so professor-specific FAQ entries
can be created and changed.
*/
function ProfessorFaqPage() {

    const storedSupervisorId =
        localStorage.getItem(
            "supervisorId"
        );


    let supervisorId: number | null =
        null;


    if (
        storedSupervisorId != null
    ) {

        const parsedSupervisorId =
            Number(
                storedSupervisorId
            );


        if (
            Number.isNaN(
                parsedSupervisorId
            ) == false
        ) {

            supervisorId =
                parsedSupervisorId;
        }
    }


    return (
        <FaqPage
            isProfessor={
                true
            }
            supervisorId={
                supervisorId
            }
        />
    );
}


/*
The professor ID of the student
is available through StudentProvider.
Students can only read FAQ entries.
*/
function StudentFaqPage() {

    const {
        supervisorId
    } = useStudent();


    return (
        <FaqPage
            isProfessor={
                false
            }
            supervisorId={
                supervisorId
            }
        />
    );
}


/*
The thesis ID is loaded
through StudentProvider.
Students can manage
their own outline chapters.
*/
function StudentOutlinePage() {

    const {
        thesisId
    } = useStudent();


    return (
        <OutlinePage
            thesisId={
                thesisId
            }
            isProfessor={
                false
            }
        />
    );
}


/*
The thesis ID is part
of the professor URL.
For example:
professor/thesis/12/outline
*/
function ProfessorOutlinePage() {

    const {
        id
    } = useParams();


    let thesisId: number | null =
        null;


    if (
        id != null
    ) {

        const parsedThesisId =
            Number(
                id
            );


        if (
            Number.isNaN(
                parsedThesisId
            ) == false
        ) {

            thesisId =
                parsedThesisId;
        }
    }


    return (
        <OutlinePage
            thesisId={
                thesisId
            }
            isProfessor={
                true
            }
        />
    );
}


/*
The thesis ID and deadline
are provided by StudentProvider.
*/
function StudentCalendarPage() {
    const {
        thesisId,
        deadline
    } = useStudent();

    return (
        <CalendarPage
            thesisId={
                thesisId
            }
            deadline={
                deadline
            }
        />
    );
}


/*
This component defines
all routes of the application.
The application contains:
login
registration
professor pages
student pages
*/
function App() {

    return (

        <Routes>


            {/* LOGIN */}

            <Route
                path="/"
                element={
                    <LoginPage />
                }
            />


            {/* REGISTRIERUNG */}

            <Route
                path="/register"
                element={
                    <RegisterPage />
                }
            />

            <Route
                path="/register/student"
                element={
                    <RegisterStudentPage />
                }
            />

            <Route
                path="/register/professor"
                element={
                    <RegisterProfessorPage />
                }
            />


            {/* PROFESSOR STARTSEITE */}

            <Route
                path="/professor"
                element={
                    <ProfStartpage />
                }
            />


            {/*
            The thesis ID is stored
            inside the URL parameter :id.
            ProfDashboardSkeleton provides
            the common professor layout.
            The child page is rendered
            thr ough its Outlet.
            */}
            <Route
                path="/professor/thesis/:id"
                element={
                    <ProfDashboardSkeleton />
                }
            >
                <Route
                    index
                    element={
                        <ThesisDetail />
                    }
                />
                <Route
                    path="outline"
                    element={
                        <ProfessorOutlinePage />
                    }
                />
                <Route
                    path="calendar"
                    element={
                        <ProfCalendarPage />
                    }
                />

                <Route
                    path="faq"
                    element={
                        <ProfessorFaqPage />
                    }
                />

            </Route>


            {/*
            StudentProvider loads
            the information of the logged-in student.
            StudentLayout decides whether
            the waiting page or normal dashboard
            should be displayed.
            */}
            <Route
                path="/student"
                element={
                    <StudentProvider />
                }
            >

                <Route
                    element={
                        <StudentLayout />
                    }
                >

                    <Route
                        index
                        element={
                            <StudentDashboard />
                        }
                    />

                    <Route
                        path="homepage"
                        element={
                            <StudentDashboard />
                        }
                    />

                    <Route
                        path="outline"
                        element={
                            <StudentOutlinePage />
                        }
                    />

                    <Route
                        path="calendar"
                        element={
                            <StudentCalendarPage />
                        }
                    />
                    <Route
                        path="faq"
                        element={
                            <StudentFaqPage />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <ErrorPage />
                        }
                    />

                </Route>
            </Route>


            {/*
            Any URL that does not match
            one of the routes above
            displays the ErrorPage.
            */}
            <Route
                path="*"
                element={
                    <ErrorPage />
                }
            />

        </Routes>
    );
}


export default App;