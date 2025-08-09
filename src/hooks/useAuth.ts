import { createContext, useContext } from 'react';

// Define the shape of the context data
export interface AuthContextType {
  isAuthenticated: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};