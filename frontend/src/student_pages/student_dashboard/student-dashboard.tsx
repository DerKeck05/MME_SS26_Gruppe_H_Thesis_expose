import {useStudent} from "../route_handling/student-provider.tsx";
import ThesisDashboard from "../../shared_pages/thesis-dashboard.tsx";

function StudentDashboard() {
    const {thesisId, deadline} = useStudent();

    return (
        <ThesisDashboard
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}

export default StudentDashboard;