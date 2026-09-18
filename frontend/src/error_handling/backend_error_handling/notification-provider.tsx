/*import {createContext, useState} from "react";

type ErrorContextType = {
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function NotificationProvider({children}: { children: React.ReactNode }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function showError(message: string) {
        setErrorMessage(message);

        setTimeout(
            () => {
                setErrorMessage(null);

            }, 5000
        );

        return (
            <ErrorContext.
        )
    }
}*/