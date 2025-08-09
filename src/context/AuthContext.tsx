import { useState, useEffect } from "react";
import axios from "axios";
import { login as apiLogin } from "../api/authService";
import { AuthContext } from "../hooks/useAuth";
import api from "../api/axiosClient";
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import { AUTH_TOKEN_KEY } from "../constants"; 

type LoginCredentials = { email: string; password: string };
type AuthState = "checking" | "authenticated" | "unauthenticated";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ 1. Manage the token with our hook. This is now the single source of truth for the token.
  const [token, setToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);

  // ✅ 2. This state represents the *verification status*, which is derived from the token.
  const [authState, setAuthState] = useState<AuthState>("checking");

  // ✅ 3. This effect now runs whenever the token changes (login, logout, or tab sync).
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthState("unauthenticated");
        return;
      }

      // When a token exists, we are in a "checking" state until it's verified.
      setAuthState("checking");

      try {
        // The interceptor in axiosClient automatically adds the token from storage.
        await api.get("/auth/verify");
        setAuthState("authenticated");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("Token verification failed (401): Token is invalid or expired.");
        } else {
          console.error("An unexpected error occurred during token verification:", err);
        }
        // If verification fails, the token is invalid. Remove it.
        // This will trigger this useEffect again, which will hit the `!token` case.
        setToken(null);
      }
    };

    verifyToken();
  }, [token, setToken]); // Depend on the token from our hook.

  const login = async (credentials: LoginCredentials) => {
    const { data } = await apiLogin(credentials);
    // ✅ 4. Set the token using our hook's setter. This updates localStorage AND state.
    setToken(data.access_token);
    // We can confidently set the state here to avoid a "checking" flash.
    setAuthState("authenticated");
  };

 const logout = async () => {
    try {
      // 1. Call the backend. The browser will automatically send the httpOnly cookie.
      // We no longer send a body.
      await api.post('/auth/logout');
    } catch (error) {
      // It's fine if this fails (e.g., cookie already expired).
      // The main goal is client-side cleanup.
      console.error("Server logout call failed, proceeding with client cleanup:", error);
    }
    
    // 2. Clear the access token from localStorage and React state. This logs the user out
    // on the client.
    setToken(null);
    
    // 3. Redirect the user.
    window.location.href = '/login';
  };

  // While checking, render nothing to prevent UI flicker.
  if (authState === "checking") {
    return null; // Or a full-page loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: authState === 'authenticated', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};