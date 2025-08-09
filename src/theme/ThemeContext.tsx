import React, { useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { ThemeContext } from './useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { THEME_MODE_KEY } from '../constants';

export type ThemeMode = 'light' | 'dark';

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage directly, defaulting to 'dark'
const [mode, setMode] = useLocalStorage<ThemeMode>(THEME_MODE_KEY, 'dark');


  useEffect(() => {
    // This effect now syncs the theme state with the DOM's class and localStorage
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
  }, [mode]); // Re-run this effect whenever the 'mode' changes

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};