
import React, { useState, lazy, Suspense } from 'react';
import GameMenu from '../components/GameMenu';
import { GameSettingsProvider } from '../contexts/GameSettingsContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';

const SnakeGame = lazy(() => import('../components/SnakeGame'));
const GameCountdown = lazy(() => import('../components/GameCountdown'));

const GameContent = () => {
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing'>('menu');
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [gameMode, setGameMode] = useState<GameMode>('chaos');
  const { theme } = useTheme();

  const handleStartGame = (speed: 'slow' | 'normal' | 'fast', mode: GameMode) => {
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
      <main className="relative w-full h-screen">
        {gameState === 'menu' && (
          <GameMenu onStartGame={handleStartGame} />
        )}
        
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
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
