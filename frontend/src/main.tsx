import { StrictMode} from "react";
import { createRoot} from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import { MantineProvider} from "@mantine/core";
import App from "./App.tsx";
import { ErrorProvider} from "./globals/error-provider.tsx";
import "./index.css";
import "./app_theme/theme.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";


/*
The root element is defined
inside index.html.
The complete React application
is rendered inside this element.
*/
const rootElement =
    document.getElementById(
        "root"
    );


/*
The application cannot start
if the root element does not exist.
*/
if (
    rootElement == null
) {

    throw new Error(
        "Root-Element konnte nicht gefunden werden."
    );
}


/*
The providers wrap the complete application:
StrictMode:
Helps find development problems.
MantineProvider:
Provides Mantine components and styles.
ErrorProvider:
Makes the shared error display available.
BrowserRouter:
Provides routing for the application.
*/
createRoot(
    rootElement
).render(

    <StrictMode>

        <MantineProvider>

            <ErrorProvider>

                <BrowserRouter>

                    <App />

                </BrowserRouter>

            </ErrorProvider>

        </MantineProvider>

    </StrictMode>
);