import { createTheme, type ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#0F172A', light: '#475569' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    success: { main: '#10B981', light: '#ECFDF5' },
    warning: { main: '#F59E0B', light: '#FFFBEB' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h4: { fontWeight: 800, color: '#0F172A' },
    subtitle2: { fontWeight: 600, color: '#64748B' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.02)',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);