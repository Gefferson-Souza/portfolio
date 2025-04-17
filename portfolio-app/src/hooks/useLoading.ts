import { useState, useCallback } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  const setLoading = useCallback((state: boolean) => {
    setIsLoading(state);
  }, []);

  return { isLoading, setLoading };
};