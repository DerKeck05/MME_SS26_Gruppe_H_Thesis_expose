import {createContext, useContext, useEffect, useState} from "react";
import {getStudent} from "../../apis/student-api.ts";
import {Outlet} from "react-router-dom";
import type {CalendarEvent} from "../calendar_pages/calendar-component.tsx";
import {getThesisDeadline} from "../../utils/thesis-utils.ts";

type StudentContextType = {
    studentId: number | null;
    thesisId: number | null;
    isLoading: boolean;
    deadline: CalendarEvent | null;
};

const StudentContext = createContext<StudentContextType | null>(null);

function StudentProvider() {
    const [thesisId, setThesisId] = useState<number | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deadline, setDeadline] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        async function loadStudent() {
            try {
                const storedStudiId = localStorage.getItem("studentId");

                if (!storedStudiId) {
                    return;
                }

                const id = Number(storedStudiId);
                const student = await getStudent(id);

                const currentThesisId = student.thesis?.id ?? null;

                let dl: CalendarEvent | null = null;

                if (currentThesisId != null) {
                    dl = await getThesisDeadline(currentThesisId);
                }

                setStudentId(student.id);
                setThesisId(currentThesisId);
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

    return (
        <StudentContext.Provider
            value={{
                studentId,
                thesisId,
                isLoading,
                deadline
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