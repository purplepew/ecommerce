'use client'
import { createTheme, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}

export default layout