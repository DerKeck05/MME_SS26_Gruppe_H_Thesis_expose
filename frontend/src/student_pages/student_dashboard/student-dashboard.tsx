import {useStudent} from "../route_handling/student-provider.tsx";
import ThesisDashboard from "../../shared_pages/thesis-dashboard.tsx";


function StudentDashboard() {

    // Gets the thesis and deadline of the currently logged-in student.
    const {thesisId, deadline} = useStudent();

    // Uses the shared dashboard component so student and professor
    // can display the same thesis dashboard data.
    return (
        <ThesisDashboard
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}


export default StudentDashboard;