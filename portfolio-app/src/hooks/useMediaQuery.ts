import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Definir o valor inicial
    setMatches(media.matches);
    
    // Callback para quando o mediaQuery mudar
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Adicionar o listener
    media.addEventListener('change', listener);
    
    // Limpar o listener na desmontagem
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};