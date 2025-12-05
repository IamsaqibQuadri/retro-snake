import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type SnakeSkin = 'remix' | 'classic' | 'tetris';

interface SnakeSkinContextType {
  snakeSkin: SnakeSkin;
  setSnakeSkin: (skin: SnakeSkin) => void;
}

const SnakeSkinContext = createContext<SnakeSkinContextType | undefined>(undefined);

export const SnakeSkinProvider = ({ children }: { children: ReactNode }) => {
  const [snakeSkin, setSnakeSkin] = useState<SnakeSkin>(() => {
    const saved = localStorage.getItem('snake-skin');
    return (saved as SnakeSkin) || 'remix';
  });

  useEffect(() => {
    localStorage.setItem('snake-skin', snakeSkin);
  }, [snakeSkin]);

  return (
    <SnakeSkinContext.Provider value={{ snakeSkin, setSnakeSkin }}>
      {children}
    </SnakeSkinContext.Provider>
  );
};

export const useSnakeSkin = () => {
  const context = useContext(SnakeSkinContext);
  if (!context) {
    throw new Error('useSnakeSkin must be used within a SnakeSkinProvider');
  }
  return context;
};