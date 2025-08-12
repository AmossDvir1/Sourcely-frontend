import { useState, useEffect, useCallback } from "react";
import { login as apiLogin } from "../api/authService";
import { AuthContext, type User, type AuthContextType } from "../hooks/useAuth"; 
import api from "../api/axiosClient";
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import { AUTH_TOKEN_KEY } from "../constants"; 
import PageLoader from "../pages/PageLoader";
import { AnimatePresence } from "framer-motion";

type LoginCredentials = { email: string; password: string };
type AuthState = "checking" | "authenticated" | "unauthenticated";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  // This initial state is crucial for showing the loader on the very first render.
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Server logout call failed, proceeding with client-side cleanup:", error);
    } finally {
      setToken(null);
      setUser(null);
      setAuthState("unauthenticated");
    }
  }, [setToken]);

  // This useEffect now handles all initial verification scenarios consistently.
  useEffect(() => {
    const verifyUser = async () => {
      // Create the minimum delay promise. This will now apply to all scenarios.
      const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

      if (!token) {
        // SCENARIO 1: A new user or a logged-out user.
        // There's no token, so no API call is needed.
        // We just wait for the minimum delay to ensure the loader shows.
        await minDelay;
        setAuthState("unauthenticated");
        setUser(null);
        return; // End execution here.
      }

      // SCENARIO 2 & 3: A token exists, so we must verify it.
      try {
        const apiCall = api.get<{ user: User }>("/auth/verify");
        // Wait for both the API call AND the minimum delay to complete.
        const [response] = await Promise.all([apiCall, minDelay]);

        // SCENARIO 2: Token is VALID.
        setUser(response.data.user);
        setAuthState("authenticated");
      } catch (err) {
        // SCENARIO 3: Token is INVALID.
        console.error("Token verification failed:", err);
        // Ensure we still wait for the delay in case the API failed instantly.
        await minDelay;
        setToken(null); // This will trigger a clean re-run of the effect.
      }
    };

    verifyUser();
    // Re-running only when `token` changes is the correct dependency.
  }, [token, setToken]);


  // This listener for active session failures remains the same. It's for
  // when a token expires while the user is actively using the app.
  useEffect(() => {
    const handleAuthFailure = () => {
      logout();
    };
    window.addEventListener('auth-failure', handleAuthFailure);
    return () => {
      window.removeEventListener('auth-failure', handleAuthFailure);
    };
  }, [logout]);


  const login = async (credentials: LoginCredentials) => {
    const { data } = await apiLogin(credentials);
    setToken(data.access_token);
    setUser(data.user);
    setAuthState("authenticated");
  };



  const value: AuthContextType = {
    isAuthenticated: authState === 'authenticated',
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      <AnimatePresence mode="wait">
        {authState === "checking" ? (
          <PageLoader key="loader" />
        ) : (
          <div key="content" className="h-full">
            {children}
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};