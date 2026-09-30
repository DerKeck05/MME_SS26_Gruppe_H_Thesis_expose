import StudentDashboardSkeleton from "../skeleton/student-dashboard-skeleton.tsx";
import StudentLandingPage from "./student-landing-page.tsx";
import { useStudent} from "./student-provider.tsx";

/*
This component decides
which student page should be shown.
*/
function StudentLayout() {

    /*
    The provider gives access
    to the current student state.
    */
    const {
        isLoading,
        studentId,
        thesisId
    } = useStudent();


    /*
    While the student information
    is still loading,
    a simple loading message is shown.
    */
    if (
        isLoading
    ) {

        return (
            <div>
                Lade...
            </div>
        );
    }


    /*
    If no student ID exists,
    the student could not be loaded.
    */
    if (
        studentId == null
    ) {

        return (
            <div>
                Student konnte nicht geladen werden.
            </div>
        );
    }


    /*
    If the student exists
    but has no thesis yet,
    the waiting page is shown.
    */
    if (
        thesisId == null
    ) {

        return (
            <StudentLandingPage
                studentId={
                    studentId
                }
            />
        );
    }


    /*
    If both student and thesis exist,
    the normal dashboard is shown.
    */
    return (
        <StudentDashboardSkeleton />
    );
}

export default StudentLayout;