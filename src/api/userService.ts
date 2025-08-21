import api from './axiosClient';
import type { User } from '../hooks/useAuth';

// Define the shape of the data we will send TO the backend
interface UserUpdatePayload {
  firstName: string;
  lastName: string;
}

/**
 * Updates the profile for the currently authenticated user.
 * @param profileData - The user's first and last name.
 * @returns The updated user object from the backend.
 */
export const updateUserProfile = (profileData: UserUpdatePayload) => {
  // The backend returns the full user object, so we type the response as User
  return api.put<User>('/auth/users/me', profileData); 
};