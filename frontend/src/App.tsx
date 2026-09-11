import {Routes, Route} from "react-router-dom";
import StudentDashboardSkeleton from "./student_pages/skeleton/student-dashboard-skeleton.tsx";
import OutlinePage from "./student_pages/outline_pages/outline_page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";

function App() {
    return (
        <Routes>
            <Route element={<StudentDashboardSkeleton/>}>
                <Route path="/" element={<StudentDashboard/>}/>
                <Route path="/outline" element={<OutlinePage/>}/>
            </Route>
        </Routes>
    );
}

export default App;