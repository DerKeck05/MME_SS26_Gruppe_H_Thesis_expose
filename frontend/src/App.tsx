import {Routes, Route} from "react-router-dom";
import StudentDashboardSkeleton from "./student_pages/skeleton/student-dashboard-skeleton.tsx";
import OutlinePage from "./student_pages/outline_pages/outline_page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import LoginPage from "./login/login_page.tsx";
import RegisterPage from "./login/register_page.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage/>}/>

            <Route element={<StudentDashboardSkeleton />}>
                <Route path="/Student" element={<StudentDashboard />} />
                <Route path="/outline" element={<OutlinePage />} />
            </Route>
        </Routes>
    );
}

export default App;