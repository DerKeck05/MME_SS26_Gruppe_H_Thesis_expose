import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import "./app_theme/theme.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import {MantineProvider} from "@mantine/core";

import App from './App.tsx'
import {BrowserRouter} from "react-router-dom"
import {ErrorProvider} from "./globals/error-provider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <ErrorProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ErrorProvider>
        </MantineProvider>
    </StrictMode>,
)
