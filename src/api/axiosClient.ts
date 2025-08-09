import axios from 'axios';
import { storage } from '../utils/localStorage';
import { AUTH_TOKEN_KEY } from '../constants';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}`;

const api = axios.create({
  baseURL,
  withCredentials: true, // ✅ Needed for cookies
});

// Attach access token to every request
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

// Handle 401 & auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ FIX 1: Add a condition to check that the failed request was NOT the refresh endpoint.
    // This is the most critical change to prevent the infinite loop.
    const isRefreshFailure = originalRequest.url.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshFailure) {
      originalRequest._retry = true;

      try {
        console.log("Access token expired. Attempting to refresh...");
        const res = await api.post('/auth/refresh');
        const { access_token } = res.data;

        storage.setItem(AUTH_TOKEN_KEY, access_token);
        console.log("Token refresh successful. Retrying original request.");

        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        // ✅ FIX 2: If the refresh itself fails, the user is truly unauthenticated.
        // We must log them out completely on the client side.
        console.error("Token refresh failed. User is unauthenticated. Logging out.", refreshError);
        storage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = '/login'; // Force a redirect to the login page.
        return Promise.reject(refreshError);
      }
    }

    // If the error is not a 401 or if it's a refresh failure, just reject it.
    return Promise.reject(error);
  }
);

export default api;
