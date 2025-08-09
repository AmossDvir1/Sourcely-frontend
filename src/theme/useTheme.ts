import { createContext, useContext } from 'react';
import type { ThemeMode } from './ThemeContext';

export type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark', // Default mode
  toggleTheme: () => {
    

  },
});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};