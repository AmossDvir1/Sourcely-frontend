// theme.ts
import { createTheme as createClassicTheme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';  // ← import CSSObject

// shared base
const baseTypography = {
  fontFamily: 'Inter, sans-serif',
  h1: { fontWeight: 700 },
  h4: { fontWeight: 700 },
};
const baseComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        // explicitly literal for textTransform, and cast the whole object as CSSObject
        textTransform: 'none' as const,
        borderRadius: 8,
        fontWeight: 600,
      } as CSSObject,
    },
  },
};

export const lightTheme = createClassicTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#2C698D' },
    secondary: { main: '#BAE8E8' },
    accent:    { main: '#FFB400' },
    background:{ default: '#F4F6F8', paper: '#FFFFFF' },
    text:      { primary: '#212121', secondary: '#616161' },
    success:   { main: '#4CAF50' },
    warning:   { main: '#FFC107' },
    error:     { main: '#F44336' },
  },
  typography: baseTypography,
  components:  baseComponents,
});

export const darkTheme = createClassicTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#3399FF' },
    secondary: { main: '#E3F6F5' },
    accent:    { main: '#FFCC33' },
    background:{ default: '#121212', paper: '#1E1E1E' },
    text:      { primary: '#E0E0E0', secondary: '#A0A0A0' },
    success:   { main: '#66BB6A' },
    warning:   { main: '#FFCA28' },
    error:     { main: '#EF5350' },
  },
  typography: baseTypography,
  components:  baseComponents,
});
