import {Routes, Route} from "react-router-dom";
import StudentDashboardSkeleton from "./student_pages/skeleton/student-dashboard-skeleton.tsx";
import OutlinePage from "./student_pages/outline_pages/outline-page.tsx";
import StudentDashboard from "./student_pages/student_dashboard/student-dashboard.tsx";
import CalendarPage from "./student_pages/calendar_pages/calendar-page.tsx";
import ErrorPage from "./student_pages/error-page.tsx";

function App() {
    return (
        <Routes>
            {/* Defines the Routing for the application */}
            <Route element={<StudentDashboardSkeleton/>} errorElement={<ErrorPage />}>
                <Route path="/" element={<StudentDashboard/>}/>
                <Route path="/outline" element={<OutlinePage/>}/>
                <Route path="/calendar" element={<CalendarPage/>}/>
                <Route path="*" element={<ErrorPage />}/> {/* Catch-all route for undefined paths */}
            </Route>
        </Routes>
    );
}

export default App;