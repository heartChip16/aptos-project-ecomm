import React from 'react';
import { ThemeProvider, Theme } from '@emotion/react';
import { CssBaseline, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

import Providers from "./providers";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

export default function Layout(): JSX.Element {
    const theme: Theme = createTheme({
        palette: {
            mode: 'light',
            // mode: "dark",
        },
    });

    return (
        <Providers>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
                <main>
                    <Outlet />
                </main>
                <footer>{/* Optional footer content */}</footer>
            </ThemeProvider>
        </Providers>

    );
}
