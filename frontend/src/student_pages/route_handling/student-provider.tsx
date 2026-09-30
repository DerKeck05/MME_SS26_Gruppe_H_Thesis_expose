import {createContext,useContext,useEffect,useState} from "react";
import {Outlet} from "react-router-dom";
import {getStudent} from "../../apis/student-api.ts";
import type {CalendarEvent} from "../calendar_pages/calendar-component.tsx";
import {getThesisDeadline} from "../../utils/thesis-utils.ts";
import Loading from "../../globals/loading.tsx";
import {useError} from "../../globals/error-provider.tsx";


/*
This type describes all information
that the StudentProvider makes available
to the student pages.
*/
type StudentContextType = {
    studentId: number | null;
    thesisId: number | null;
    supervisorId: number | null;
    isLoading: boolean;
    deadline: CalendarEvent | null;
};


/*
At the beginning there is no context value.
The value is provided later
by StudentProvider.
*/
const StudentContext =
    createContext<StudentContextType | null>(
        null
    );


/*
The provider loads the information
of the currently logged in student.
The loaded data can then be used
by all student pages below this provider.
*/
function StudentProvider() {

    /*
    These states store:
    - student ID
    - thesis ID
    - professor ID
    - thesis deadline
    */
    const [
        studentId,
        setStudentId
    ] = useState<number | null>(null);

    const [
        thesisId,
        setThesisId
    ] = useState<number | null>(null);

    const [
        supervisorId,
        setSupervisorId
    ] = useState<number | null>(null);

    const [
        deadline,
        setDeadline
    ] = useState<CalendarEvent | null>(null);


    /*

    The loading screen is shown
    while the student information
    is loaded from the backend.
    */
    const [
        isLoading,
        setIsLoading
    ] = useState(true);


    /*
    showError displays errors
    using the global error provider.
    */
    const {
        showError
    } = useError();


    /*
    This effect runs
    when the provider is opened.
    First the student ID
    is read from localStorage.
    After that the student,
    thesis and deadline information
    are loaded.
    */
    useEffect(() => {

        async function loadStudent() {

            try {

                /*
                The student ID was stored
                in localStorage during login.
                */
                const storedStudentId =
                    localStorage.getItem(
                        "studentId"
                    );


                /*
                Without a student ID
                no student can be loaded.
                */
                if (
                    storedStudentId == null
                ) {

                    return;
                }


                /*
                localStorage always returns strings.
                Therefore the ID
                has to be converted into a number.
                */
                const id =
                    Number(
                        storedStudentId
                    );


                if (
                    Number.isNaN(id)
                ) {

                    throw new Error(
                        "Ungültige Student-ID."
                    );
                }


                /*
                Load the complete student information
                from the backend.
                */
                const student =
                    await getStudent(
                        id
                    );


                /*
                A student can have
                no thesis yet.
                In this case the thesis ID
                stays null.
                */
                const loadedThesisId =
                    student.thesis != null
                        ? student.thesis.id
                        : null;


                /*
                The professor ID can also
                theoretically be null.
                */
                const loadedSupervisorId =
                    student.supervisorId != null
                        ? student.supervisorId
                        : null;


                /*
                The deadline can only be loaded
                if the student already has a thesis.
                */
                let loadedDeadline:
                    CalendarEvent | null =
                    null;


                if (
                    loadedThesisId != null
                ) {

                    loadedDeadline =
                        await getThesisDeadline(
                            loadedThesisId
                        );
                }


                /*
                The loaded information
                is stored in the provider states.
                */
                setStudentId(
                    student.id
                );

                setThesisId(
                    loadedThesisId
                );

                setSupervisorId(
                    loadedSupervisorId
                );

                setDeadline(
                    loadedDeadline
                );


            } catch (error) {

                console.error(
                    "Student konnte nicht geladen werden:",
                    error
                );


                if (
                    error instanceof Error
                ) {

                    showError(
                        error.message
                    );

                } else {

                    showError(
                        "Student konnte nicht geladen werden!"
                    );
                }


            } finally {

                /*
                Loading is finished
                whether the request
                was successful or not.
                */
                setIsLoading(
                    false
                );
            }
        }


        loadStudent();

    }, [
        showError
    ]);


    /*
    The student pages are only rendered
    after all required student information
    has been loaded.
    */
    if (
        isLoading
    ) {

        return (
            <Loading />
        );
    }


    /*
    All student pages below the provider
    can access these values
    using useStudent().
    */
    return (

        <StudentContext.Provider
            value={{
                studentId:
                    studentId,

                thesisId:
                    thesisId,

                supervisorId:
                    supervisorId,

                isLoading:
                    isLoading,

                deadline:
                    deadline
            }}
        >

            <Outlet />

        </StudentContext.Provider>
    );
}


export default StudentProvider;


/*
This helper function gives other components
easy access to the StudentContext.
If it is used outside StudentProvider,
an error is thrown.
*/
export function useStudent() {

    const context =
        useContext(
            StudentContext
        );


    if (
        context == null
    ) {

        throw new Error(
            "useStudent muss innerhalb des StudentProviders verwendet werden"
        );
    }

    return context;
}