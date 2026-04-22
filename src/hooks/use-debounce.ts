import { useState, useEffect } from 'react';

/**
 * Hook for debouncing values (e.g., search input)
 * @param value - Value to debounce
 * @param delay - Debounce delay in ms (default: 300)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
