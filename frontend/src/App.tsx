import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getThemeOptions } from './theme/index.ts';
import { useAuth } from './hooks/useAuth.ts';
import { useMemo } from 'react';
import { PresenceProvider } from './context/PresenceContext.jsx';

function App() {
    const { user } = useAuth();

    const theme = useMemo(() => {
        const mode = user?.themePreference || 'light';
        return createTheme(getThemeOptions(mode));
    }, [user?.themePreference]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <BrowserRouter>
                    <PresenceProvider>
                        <AppRoutes />
                    </PresenceProvider>
                </BrowserRouter>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
