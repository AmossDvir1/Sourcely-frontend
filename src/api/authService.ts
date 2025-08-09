import api from './axiosClient'; // ✅ Use the centralized axios instance

/* eslint-disable @typescript-eslint/no-explicit-any */
export const login = (credentials: any) => api.post('/auth/login', credentials);
export const register = (userInfo: any) => api.post('/auth/register', userInfo);