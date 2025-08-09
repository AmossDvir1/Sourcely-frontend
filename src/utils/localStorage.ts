/**
 * A centralized, type-safe utility for interacting with localStorage.
 */
export const storage = {
  /**
   * Retrieves a JSON-parsed value from localStorage.
   * @param key The key of the item to retrieve.
   * @returns The parsed value, or null if the item doesn't exist or parsing fails.
   */
  getItem: <T>(key: string): T | null => {
    // Check if window is defined for server-side rendering (SSR) environments
    if (typeof window === 'undefined') {
      return null;
    }
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    try {
      // Attempt to parse the item as JSON
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Failed to parse stored value for key "${key}":`, e);
      return null; // Return null if parsing fails
    }
  },

  /**
   * Stores a value in localStorage after serializing it to JSON.
   * @param key The key to store the item under.
   * @param value The value to store. Must be JSON-serializable.
   */
  setItem: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to store value for key "${key}":`, e);
    }
  },

  /**
   * Removes an item from localStorage.
   * @param key The key of the item to remove.
   */
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  },
};