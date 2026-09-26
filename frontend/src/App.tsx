import { Routes, Route } from "react-router-dom";

import OutlinePage from "./student_pages/outline_pages/outline-page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import CalendarPage from "./student_pages/calendar_pages/calendar-page.tsx";
import ErrorPage from "./student_pages/error-page.tsx";

import LoginPage from "./login/login_page.tsx";
import RegisterPage from "./login/register_page.tsx";
import RegisterStudentPage from "./login/register_student.tsx";
import RegisterProfessorPage from "./login/register_prof.tsx";

import ProfStartpage from "./prof_pages/prof_starpage.tsx";
import ThesisDetail from "./prof_pages/thesis_detail.tsx";
import ProfDashboardSkeleton from "./prof_pages/prof_dashboard_skeleton.tsx";

import StudentWaiting from "./student_pages/student_waiting.tsx";

import StudentProvider from "./student_pages/route_handling/student-provider.tsx";
import StudentLayout from "./student_pages/route_handling/student-layout.tsx";


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


            {/* Professor Bereich */}
            <Route
                path="/professor"
                element={<ProfStartpage />}
            />

            <Route
                path="/professor/thesis/:id"
                element={<ProfDashboardSkeleton />}
            >
                <Route
                    index
                    element={<ThesisDetail />}
                />
            </Route>


            {/* Student wartet noch auf Thesis */}
            <Route
                path="/student/waiting"
                element={<StudentWaiting />}
            />


            {/* Student Bereich */}
            <Route
                path="/student"
                element={<StudentProvider />}
                errorElement={<ErrorPage />}
            >

                <Route element={<StudentLayout />}>

                    {/* Standardseite für /student */}
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
                        element={<OutlinePage />}
                    />

                    <Route
                        path="calendar"
                        element={<CalendarPage />}
                    />

                    {/* Unbekannte Route */}
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