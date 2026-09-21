import { Routes, Route } from "react-router-dom";

import StudentDashboardSkeleton from "./student_pages/skeleton/student-dashboard-skeleton.tsx";
import OutlinePage from "./student_pages/outline_pages/outline-page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import CalendarPage from "./student_pages/calendar_pages/calendar-page.tsx";
import ErrorPage from "./student_pages/error-page.tsx";

import LoginPage from "./login/login_page.tsx";
import RegisterPage from "./login/register_page.tsx";
import RegisterStudentPage from "./login/register_student.tsx";
import RegisterProfessorPage from "./login/register_prof.tsx";


function App() {
    return (
        <Routes>

            {/* Login */}
            <Route path="/" element={<LoginPage />} />

            {/* Registrierung */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/student" element={<RegisterStudentPage />} />
            <Route path="/register/professor" element={<RegisterProfessorPage />} />


            {/* Student Bereich */}
            <Route
                element={<StudentDashboardSkeleton />}
                errorElement={<ErrorPage />}
            >

                <Route path="/Student" element={<StudentDashboard />} />

                <Route path="/outline" element={<OutlinePage />} />

                <Route path="/calendar" element={<CalendarPage />} />

                {/* Falls eine unbekannte Route aufgerufen wird */}
                <Route path="*" element={<ErrorPage />} />

            </Route>

        </Routes>
    );
}


export default App;