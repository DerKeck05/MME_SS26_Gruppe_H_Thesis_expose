import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import "./app_theme/theme.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import {MantineProvider} from "@mantine/core";

import App from './App.tsx'
import {BrowserRouter} from "react-router-dom"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </MantineProvider>
    </StrictMode>,
)
