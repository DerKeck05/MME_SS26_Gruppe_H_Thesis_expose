import StudentDashboardSkeleton from "../skeleton/student-dashboard-skeleton.tsx";
import StudentLandingPage from "./student-landing-page.tsx";
import {useStudent} from "./student-provider.tsx";

function StudentLayout() {
    const {
        isLoading,
        studentId,
        thesisId
    } = useStudent();

    if (isLoading) {
        return <div>Lade...</div>;
    }

    if (studentId == null) {
        return <div>Student konnte nicht geladen werden.</div>;
    }

    if (thesisId == null) {
        return <StudentLandingPage studentId={studentId}/>;
    }

    return <StudentDashboardSkeleton/>;
}

export default StudentLayout;