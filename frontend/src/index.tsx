import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import App from "./App";
import "./styles/global.css";

const theme = createTheme({
    palette: {
        primary: { main: "#4f46e5" },
        background: { default: "#f5f7fb" }
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif'
    },
    shape: {
        borderRadius: 10
    }
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
