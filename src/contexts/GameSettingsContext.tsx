
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GameSettings {
  soundEnabled: boolean;
  snakeColor: string;
  snakeBodyColor: string;
}

interface GameSettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  toggleSound: () => void;
  setSnakeColors: (headColor: string, bodyColor: string) => void;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  snakeColor: '#22c55e', // green-500
  snakeBodyColor: '#16a34a', // green-600
};

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('snake-game-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('snake-game-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const setSnakeColors = (headColor: string, bodyColor: string) => {
    updateSettings({ 
      snakeColor: headColor, 
      snakeBodyColor: bodyColor 
    });
  };

  return (
    <GameSettingsContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        toggleSound, 
        setSnakeColors 
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};
