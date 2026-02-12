
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logger } from '../utils/logger';

export type Theme = 'light' | 'dark' | 'pastel' | 'matrix' | 'ocean';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('snake-theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('snake-theme', theme);
    logger.log('ThemeContext: Theme changed to:', theme);
    // Apply theme class to document body
    document.body.className = '';
    if (theme !== 'light') {
      document.body.classList.add(theme);
      logger.log('ThemeContext: Applied theme class:', theme, 'to body');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'pastel';
        case 'pastel': return 'matrix';
        case 'matrix': return 'ocean';
        case 'ocean': return 'light';
        default: return 'light';
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
