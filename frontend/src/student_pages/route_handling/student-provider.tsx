import {createContext, useContext, useEffect, useState} from "react";
import {getStudent} from "../../apis/student-api.ts";
import {Outlet} from "react-router-dom";
import type {CalendarEvent} from "../calendar_pages/calendar-component.tsx";
import {getThesisDeadline} from "../../utils/thesis-utils.ts";
import Loading from "../../globals/loading.tsx";
import {useError} from "../../globals/error-provider.tsx";

// Every Data the Provider can provide
type StudentContextType = {
    studentId: number | null;
    thesisId: number | null;
    supervisorId: number | null;
    isLoading: boolean;
    deadline: CalendarEvent | null;
};

const StudentContext = createContext<StudentContextType | null>(null);

function StudentProvider() {
    // Variables for the data
    const [thesisId, setThesisId] = useState<number | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [supervisorId, setSupervisorId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deadline, setDeadline] = useState<CalendarEvent | null>(null);

    // Error from Error Provider for UI error display
    const {showError} = useError();

    // loads different data at the first opening of the Student Dashboard
    useEffect(() => {
        async function loadStudent() {
            try {
                // gets Student ID from local browser storage from the login
                const storedStudiId = localStorage.getItem("studentId");

                if (!storedStudiId) return;

                // gets the different IDs from backend and stores them
                const id = Number(storedStudiId);
                const student = await getStudent(id);
                const thesisId = student.thesis?.id ?? null;
                const supervId = student.supervisorId ?? null;

                // also loads deadline
                const dl = thesisId
                    ? await getThesisDeadline(thesisId)
                    : null;

                // stores all the info into the variables
                setStudentId(student.id);
                setThesisId(thesisId);
                setSupervisorId(supervId);
                setDeadline(dl);

                console.log(student);
            } catch (e) {
                console.error("Student konnte nicht geladen werden.", e);

                showError(e instanceof Error
                    ? e.message
                    : "Student konnte nicht geladen werden!");
            } finally {
                // if All data is loaded correctly, the loading screen will disappear
                setIsLoading(false);
            }
        }

        void loadStudent();
    }, []);

    // Displays Loading Screen as long data is loading or passes the Data down
    if (isLoading) {
        return <Loading/>
    }

    return (
        <StudentContext.Provider
            value={{
                studentId,
                thesisId,
                supervisorId,
                isLoading,
                deadline,
            }}
        >
            <Outlet/>
        </StudentContext.Provider>
    );
}

export default StudentProvider;

// function to let other classes use the context of this class to use its variables
export function useStudent() {
    const context = useContext(StudentContext);

    if (!context) {
        throw new Error(
            "useStudent muss innerhalb des StudentProviders verwendet werden"
        );
    }

    return context;
}