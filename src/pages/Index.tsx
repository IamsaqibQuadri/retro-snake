
import React, { useState } from 'react';
import SnakeGame from '../components/SnakeGame';
import GameMenu from '../components/GameMenu';
import GameCountdown from '../components/GameCountdown';
import { GameSettingsProvider } from '../contexts/GameSettingsContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const GameContent = () => {
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing'>('menu');
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [gameMode, setGameMode] = useState<'classic' | 'modern'>('classic');
  const { theme } = useTheme();

  const handleStartGame = (speed: 'slow' | 'normal' | 'fast', mode: 'classic' | 'modern') => {
    setGameSpeed(speed);
    setGameMode(mode);
    setGameState('countdown');
  };

  const handleCountdownComplete = () => {
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  // Using design system tokens for consistent theming
  const backgroundClass = 'bg-background text-foreground';

  return (
    <div className={`min-h-screen font-mono overflow-hidden transition-colors duration-300 ${backgroundClass}`}>
      <div className="relative w-full h-screen">
        {gameState === 'menu' && (
          <GameMenu onStartGame={handleStartGame} />
        )}
        
        {gameState === 'countdown' && (
          <GameCountdown 
            onCountdownComplete={handleCountdownComplete}
            gameMode={gameMode}
            speed={gameSpeed}
          />
        )}
        
        {gameState === 'playing' && (
          <SnakeGame 
            speed={gameSpeed} 
            gameMode={gameMode} 
            onBackToMenu={handleBackToMenu} 
          />
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <GameSettingsProvider>
        <GameContent />
      </GameSettingsProvider>
    </ThemeProvider>
  );
};

export default Index;
