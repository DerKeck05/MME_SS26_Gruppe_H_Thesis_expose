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

// Provides the Popup of the Error Message as soon as an Error gets thrown in a frontend function
export function ErrorProvider({children}: ErrorProviderProps) {
    const [error, setError] = useState<string | null>(null);

    // if that function is called, the Error Message is shown for 5000 milliseconds
    function showError(message: string) {
        setError(message);

        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    function clearError() {
        setError(null);
    }

    {/* As soon as error Variable has received an error message the Modal is shown */}
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

// Method to use the error provider everywhere
export function useError() {
    const context = useContext(ErrorContext);

    if (!context) {
        throw new Error(
            "useError muss innerhalb eines ErrorProviders verwendet werden."
        );
    }

    return context;
}