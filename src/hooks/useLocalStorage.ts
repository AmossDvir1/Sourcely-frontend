import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/localStorage';

/**
 * A React hook that syncs a component's state with localStorage.
 * It behaves like `useState` but persists the value.
 *
 * @param key The key for the localStorage item.
 * @param defaultValue The default value to use if nothing is in storage.
 * @returns A stateful value and a function to update it.
 */
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    return storage.getItem<T>(key) ?? defaultValue;
  });

  // This effect updates localStorage whenever the state value changes.
  useEffect(() => {
    storage.setItem<T>(key, value);
  }, [key, value]);

  // This effect listens for changes in other tabs/windows and updates the state.
  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch (e) {
        console.error("Failed to parse value from storage event", e);
      }
    }
  }, [key]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);


  return [value, setValue] as const;
};