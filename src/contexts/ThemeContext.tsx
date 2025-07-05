
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'pastel' | 'gameboy';

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
    console.log('ThemeContext: Theme changed to:', theme);
    // Apply theme class to document body
    document.body.className = '';
    if (theme !== 'light') {
      document.body.classList.add(theme);
      console.log('ThemeContext: Applied theme class:', theme, 'to body');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'pastel';
        case 'pastel': return 'gameboy';
        case 'gameboy': return 'light';
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
