import { createTheme, type ThemeOptions } from '@mui/material/styles';

// On passe le mode en paramètre pour générer le thème approprié
export const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Palette Mode Clair (Existante)
          primary: { main: '#0F172A', light: '#475569' },
          background: { default: '#F8FAFC', paper: '#FFFFFF' },
          divider: '#E2E8F0',
          text: { primary: '#0F172A', secondary: '#64748B' },
        }
      : {
          // Palette Mode Sombre (Slate Premium)
          primary: { main: '#F8FAFC', light: '#94A3B8' },
          background: { default: '#020617', paper: '#0F172A' }, // Slate 950 et 900
          divider: '#1E293B',
          text: { primary: '#F8FAFC', secondary: '#94A3B8' },
          success: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)' },
          warning: { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)' },
        }),
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h4: { fontWeight: 800 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Supprime le gradient gris par défaut de MUI en dark mode
          borderRadius: '16px',
          border: '1px solid',
          borderColor: mode === 'light' ? '#E2E8F0' : '#1E293B',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid',
          borderColor: mode === 'light' ? '#E2E8F0' : '#1E293B',
          boxShadow: mode === 'light' ? '0px 2px 4px rgba(0,0,0,0.02)' : 'none',
        },
      },
    },
  },
});

// Par défaut, on peut exporter le thème clair
export const theme = createTheme(getThemeOptions('light'));