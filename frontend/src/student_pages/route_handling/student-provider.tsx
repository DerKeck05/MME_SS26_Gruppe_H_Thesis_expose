import {createContext, useContext, useEffect, useState} from "react";
import {getStudent} from "../../apis/student-api.ts";
import {Outlet} from "react-router-dom";
import type {CalendarEvent} from "../calendar_pages/calendar-component.tsx";
import {getThesisDeadline} from "../../utils/thesis-utils.ts";
import Loading from "../../globals/loading.tsx";

type StudentContextType = {
    studentId: number | null;
    thesisId: number | null;
    supervisorId: number | null;
    isLoading: boolean;
    deadline: CalendarEvent | null;
};

const StudentContext = createContext<StudentContextType | null>(null);

function StudentProvider() {
    const [thesisId, setThesisId] = useState<number | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [supervisorId, setSupervisorId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deadline, setDeadline] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        async function loadStudent() {
            try {
                const storedStudiId = localStorage.getItem("studentId");

                if (!storedStudiId) return;

                const id = Number(storedStudiId);
                const student = await getStudent(id);
                const thesisId = student.thesis?.id ?? null;
                const supervId = student.supervisorId ?? null;

                const dl = thesisId
                    ? await getThesisDeadline(thesisId)
                    : null;

                setStudentId(student.id);
                setThesisId(thesisId);
                setSupervisorId(supervId);
                setDeadline(dl);

                console.log(student);
            } catch (e) {
                console.error("Student konnte nicht geladen werden.", e);
            } finally {
                setIsLoading(false);
            }
        }

        void loadStudent();
    }, []);

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

export function useStudent() {
    const context = useContext(StudentContext);

    if (!context) {
        throw new Error(
            "useStudent muss innerhalb des StudentProviders verwendet werden"
        );
    }

    return context;
}