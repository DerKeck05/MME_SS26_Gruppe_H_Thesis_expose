import {Routes, Route} from "react-router-dom";
import StudentDashboardSkeleton from "./student_pages/skeleton/student-dashboard-skeleton.tsx";
import OutlinePage from "./student_pages/outline_pages/outline_page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import LoginPage from "./login/login_page.tsx";
import RegisterPage from "./login/register_page.tsx";
import RegisterStudentPage from "./login/register_student.tsx";
import RegisterProfessorPage from "./login/register_prof.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/register/student" element={<RegisterStudentPage/>}/>
            <Route path="/register/professor" element={<RegisterProfessorPage/>}/>

            <Route element={<StudentDashboardSkeleton />}>
                <Route path="/Student" element={<StudentDashboard />} />
                <Route path="/outline" element={<OutlinePage />} />
            </Route>
        </Routes>
    );
}

export default App;