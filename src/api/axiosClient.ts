import axios from 'axios';
import { storage } from '../utils/localStorage';
import { AUTH_TOKEN_KEY } from '../constants';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}`;

const api = axios.create({
  baseURL,
  withCredentials: true, // Needed for cookies
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

let isRefreshing = false;
// A queue of failed requests to be retried after token refresh
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Handle 401 & auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, queue the current request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Access token expired. Attempting to refresh...");
        const res = await api.post('/auth/refresh');
        const { access_token } = res.data;

        storage.setItem(AUTH_TOKEN_KEY, access_token);
        console.log("Token refresh successful. Retrying original and queued requests.");
        
        // Apply the new token to the header of the original failed request
        api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;

        // Process the queue with the new token
        processQueue(null, access_token);
        
        // Retry the original request
        return api(originalRequest);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError: any) {
        console.error("Token refresh failed. User is unauthenticated. Logging out.", refreshError);
        processQueue(refreshError, null); // Reject all queued requests
        storage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = '/login'; // Force a redirect
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
