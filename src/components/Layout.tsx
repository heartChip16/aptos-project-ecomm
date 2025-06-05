import React from 'react';
import { ThemeProvider, Theme } from '@emotion/react';
import { CssBaseline, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout(): JSX.Element {
    const theme: Theme = createTheme({
        palette: {
            mode: 'light',
            // mode: "dark",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <main>
                <Outlet />
            </main>
            <footer>{/* Optional footer content */}</footer>
        </ThemeProvider>
    );
}
