import { Routes, Route, useParams } from "react-router-dom";

import OutlinePage from "./student_pages/outline_pages/outline-page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import CalendarPage from "./student_pages/calendar_pages/calendar-page.tsx";
import ErrorPage from "./student_pages/error-page.tsx";

import LoginPage from "./login/login_page.tsx";
import RegisterPage from "./login/register_page.tsx";
import RegisterStudentPage from "./login/register_student.tsx";
import RegisterProfessorPage from "./login/register_prof.tsx";

import StudentProvider from "./student_pages/route_handling/student-provider.tsx";
import StudentLayout from "./student_pages/route_handling/student-layout.tsx";
import { useStudent } from "./student_pages/route_handling/student-provider.tsx";

import ProfStartpage from "./prof_pages/prof_starpage.tsx";
import ProfCalendarPage from "./prof_pages/prof-calender-page.tsx";
import ProfDashboardSkeleton from "./prof_pages/prof_dashboard_skeleton.tsx";
import ThesisDetail from "./prof_pages/thesis_detail.tsx";

import FaqPage from "./shared_pages/faq-page.tsx";


function ProfessorFaqPage() {
    const storedSupervisorId =
        localStorage.getItem("supervisorId");

    const supervisorId =
        storedSupervisorId
            ? Number(storedSupervisorId)
            : null;

    return (
        <FaqPage
            isProfessor={true}
            supervisorId={supervisorId}
        />
    );
}


function StudentFaqPage() {
    const { supervisorId } = useStudent();

    return (
        <FaqPage
            isProfessor={false}
            supervisorId={supervisorId}
        />
    );
}


function StudentOutlinePage() {
    const { thesisId } = useStudent();

    return (
        <OutlinePage
            thesisId={thesisId}
        />
    );
}


function ProfessorOutlinePage() {
    const { id } = useParams();

    const thesisId =
        id
            ? Number(id)
            : null;

    return (
        <OutlinePage
            thesisId={thesisId}
        />
    );
}


function StudentCalendarPage() {
    const {
        thesisId,
        deadline
    } = useStudent();

    return (
        <CalendarPage
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}


function App() {
    return (
        <Routes>

            {/* Login */}
            <Route
                path="/"
                element={<LoginPage />}
            />


            {/* Registrierung */}
            <Route
                path="/register"
                element={<RegisterPage />}
            />

            <Route
                path="/register/student"
                element={<RegisterStudentPage />}
            />

            <Route
                path="/register/professor"
                element={<RegisterProfessorPage />}
            />


            {/* Professor Übersicht */}
            <Route
                path="/professor"
                element={<ProfStartpage />}
            />


            {/* Professor Thesis Bereich */}
            <Route
                path="/professor/thesis/:id"
                element={<ProfDashboardSkeleton />}
            >
                <Route
                    index
                    element={<ThesisDetail />}
                />
                <Route
                    path="outline"
                    element={<ProfessorOutlinePage />}
                />
                <Route
                    path="calendar"
                    element={<ProfCalendarPage />}
                />

                <Route
                    path="faq"
                    element={<ProfessorFaqPage />}
                />

            </Route>


            {/* Student Bereich */}
            <Route
                path="/student"
                element={<StudentProvider />}
                errorElement={<ErrorPage />}
            >

                <Route
                    element={<StudentLayout />}
                >

                    <Route
                        index
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="homepage"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="outline"
                        element={<StudentOutlinePage />}
                    />

                    <Route
                        path="calendar"
                        element={<StudentCalendarPage />}
                    />
                    <Route
                        path="faq"
                        element={<StudentFaqPage />}
                    />

                    <Route
                        path="*"
                        element={<ErrorPage />}
                    />

                </Route>
            </Route>

        </Routes>
    );
}


export default App;