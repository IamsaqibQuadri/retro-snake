
import React, { useState } from 'react';
import SnakeGame from '../components/SnakeGame';
import GameMenu from '../components/GameMenu';
import GameCountdown from '../components/GameCountdown';
import { GameSettingsProvider } from '../contexts/GameSettingsContext';

const Index = () => {
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing'>('menu');
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [gameMode, setGameMode] = useState<'classic' | 'modern'>('classic');

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

  return (
    <GameSettingsProvider>
      <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
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
    </GameSettingsProvider>
  );
};

export default Index;
