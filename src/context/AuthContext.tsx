import { useState, useEffect, useCallback } from "react";
import { login as apiLogin } from "../api/authService";
import { AuthContext, type User, type AuthContextType } from "../hooks/useAuth";
import api from "../api/axiosClient";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AUTH_TOKEN_KEY } from "../constants";
import PageLoader from "../pages/PageLoader";
import { AnimatePresence } from "framer-motion";

type LoginCredentials = { email: string; password: string };
type AuthState = "checking" | "authenticated" | "unauthenticated";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>(
    AUTH_TOKEN_KEY,
    null
  );
  // This initial state is crucial for showing the loader on the very first render.
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(async () => {
    // This is for explicit logouts (e.g., button click)
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Server logout call failed, proceeding with client cleanup:",
        error
      );
    } finally {
      setToken(null);
      setUser(null);
      setAuthState("unauthenticated");
    }
  }, [setToken]);

  // Global listener for session expiration DURING active use.
  useEffect(() => {
    const handleAuthFailure = () => {
      console.log("Global auth-failure event received. Logging out.");
      logout();
    };
    window.addEventListener("auth-failure", handleAuthFailure);
    return () => window.removeEventListener("auth-failure", handleAuthFailure);
  }, [logout]);

  // Verification Effect: Self-contained and robust.
  useEffect(() => {
    let isCancelled = false;

    const verifyUser = async () => {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 1200));

      // If there's no token, we are unauthenticated. No API call needed.
      if (!token) {
        await minDelay;

        setAuthState("unauthenticated");
        return;
      }

      // A token exists, so we enter the checking state.
      setAuthState("checking");

      try {
        const apiCall = api.get<User>("/auth/verify");

        const [response] = await Promise.all([apiCall, minDelay]);

        // Happy path: token is valid.
        if (!isCancelled) {
          setUser(response.data);
          setAuthState("authenticated");
        }
      } catch (error) {
        console.error("[AuthProvider] 5. FAILURE: API call REJECTED..", error);
        await minDelay;

        // Failure path: token is invalid. This CATCH block is now the
        // single source of truth for handling a FAILED VERIFICATION.
        // console.error(
        //   "Verification API call failed. AuthProvider is handling the logout."
        // );
        if (!isCancelled) {
          setToken(null);
          setUser(null);
          setAuthState("unauthenticated");
        }
      }
    };

    verifyUser();

    // The essential cleanup for StrictMode and preventing race conditions.
    return () => {
      isCancelled = true;
    };
  }, [token, setToken]); // Re-run only when the token changes.

  const login = async (credentials: LoginCredentials) => {
    const { data } = await apiLogin(credentials);
    setToken(data.access_token);
    setUser(data.user);
    setAuthState("authenticated");
  };

  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
  };

  const value: AuthContextType = {
    isAuthenticated: authState === "authenticated",
    user,
    login,
    logout,
    updateUser,
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
