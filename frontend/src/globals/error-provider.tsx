import {createContext, useContext, useState, type ReactNode} from "react";
import ErrorMessage from "./error-message";

type ErrorContextType = {
    showError: (message: string) => void;
    clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | null>(null);

type ErrorProviderProps = {
    children: ReactNode;
};

export function ErrorProvider({children}: ErrorProviderProps) {
    const [error, setError] = useState<string | null>(null);

    function showError(message: string) {
        setError(message);

        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    function clearError() {
        setError(null);
    }

    return (
        <ErrorContext.Provider value={{showError, clearError}}>
            {children}

            {error && (
                <ErrorMessage
                    message={error}
                    onClose={clearError}
                />
            )}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);

    if (!context) {
        throw new Error(
            "useError muss innerhalb eines ErrorProviders verwendet werden."
        );
    }

    return context;
}