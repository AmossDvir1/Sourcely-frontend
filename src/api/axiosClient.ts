import axios from "axios";
import { storage } from "../utils/localStorage";
import { AUTH_TOKEN_KEY } from "../constants";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const ApiVersion = import.meta.env.VITE_API_VERSION;

// ====================================================================
// INSTANCE 1: The main API instance for all standard requests.
// This instance has the interceptors attached.
// ====================================================================
const api = axios.create({
  baseURL: `${baseURL}/api/${ApiVersion}`,
  withCredentials: true, // Crucial for sending cookies with requests
});

// ====================================================================
// INSTANCE 2: The "clean" instance for the refresh token call.
// This instance has NO interceptors, which is critical to prevent
// the infinite recursive loop if the refresh call itself fails.
// ====================================================================
const apiRefresh = axios.create({
  baseURL,
  withCredentials: true,
});

// ====================================================================
// INTERCEPTORS
// These are attached ONLY to the main `api` instance.
// =================================a===================================

// 1. Request Interceptor: Attach the access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem<string>(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variables for handling token refresh flow
let isRefreshing = false;
// A queue for failed requests to be retried after a successful refresh
let failedQueue: {
  resolve: (value: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Response Interceptor: Handle 401 Unauthorized errors by attempting to refresh the token.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // We only attempt a refresh if the original request had an auth token AND hasn't been retried.
    // This prevents the infinite loop for unauthenticated users who get a 401 on a protected route.
    if (
      error.response?.status === 401 &&
      originalRequest.headers.Authorization &&
      !originalRequest._retry
    ) {
      // If a refresh is already in progress, queue subsequent failed requests.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log(
          "[Interceptor] Access token expired. Attempting to refresh..."
        );

        // --- THE CRITICAL FIX ---
        // Use the "clean" apiRefresh instance to make the refresh call.
        const res = await apiRefresh.post("/auth/refresh");
        const { access_token } = res.data;

        console.log("[Interceptor] Token refresh successful.");
        storage.setItem(AUTH_TOKEN_KEY, access_token);
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

        // Process the queue with the new token
        processQueue(null, access_token);

        // Retry the original request with the newly authorized main `api` instance
        return api(originalRequest);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError: any) {
        // This block is now reachable because the infinite loop is gone.
        console.error(
          "[Interceptor] Token refresh failed. Logging out.",
          refreshError
        );
        processQueue(refreshError, null);

        const url = originalRequest.url;
        const isInitialAuthVerify = url.includes("/auth/verify");

        // Only dispatch the global event for non-essential calls.
        // The AuthProvider is responsible for handling its own initial verification failure.
        if (!isInitialAuthVerify) {
          window.dispatchEvent(new Event("auth-failure"));
        }

        // This rejection is crucial. It allows the original caller's .catch() block to run.
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, just reject them.
    return Promise.reject(error);
  }
);

// Export the main `api` instance for use throughout the application.
export default api;
