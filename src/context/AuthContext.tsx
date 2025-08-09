import { useState, useEffect } from "react";
import { login as apiLogin } from "../api/authService";
import { AuthContext, type User, type AuthContextType } from "../hooks/useAuth"; 
import api from "../api/axiosClient";
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import { AUTH_TOKEN_KEY } from "../constants"; 

type LoginCredentials = { email: string; password: string };
type AuthState = "checking" | "authenticated" | "unauthenticated";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  const [authState, setAuthState] = useState<AuthState>("checking");
  // ✅ 2. ADD STATE TO HOLD THE USER OBJECT
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthState("unauthenticated");
        setUser(null); // Make sure user is cleared
        return;
      }

      setAuthState("checking");

      try {
        // ✅ 3. EXPECT THE /verify ENDPOINT TO RETURN THE USER DATA
        const { data } = await api.get<{ user: User }>("/auth/verify");
        setUser(data.user); // Set the user
        setAuthState("authenticated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (err: any) {
        // ... (error handling)
        console.log("error occurred")
        setToken(null);
        setUser(null); // Clear user on failure
      }
    };

    verifyToken();
  }, [token, setToken]);

  const login = async (credentials: LoginCredentials) => {
    // ✅ 4. EXPECT THE LOGIN API TO RETURN THE TOKEN AND USER
    const { data } = await apiLogin(credentials);
    // Assuming data is: { access_token: "...", user: { id: "...", ... } }
    setToken(data.access_token);
    setUser(data.user);
    setAuthState("authenticated");
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Server logout call failed, proceeding with client cleanup:", error);
    }
    
    // ✅ 5. CLEAR THE USER STATE ON LOGOUT
    setUser(null);
    setToken(null);
    
    window.location.href = '/login';
  };

  if (authState === "checking") {
    return null; // Or a full-page loading spinner
  }

  // ✅ 6. PROVIDE THE USER OBJECT IN THE CONTEXT VALUE
  const value: AuthContextType = { 
    isAuthenticated: authState === 'authenticated', 
    user, // Add user to the value
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};