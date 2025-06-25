
import React, { useState } from 'react';
import SnakeGame from '../components/SnakeGame';
import GameMenu from '../components/GameMenu';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const handleStartGame = (speed: 'slow' | 'normal' | 'fast') => {
    setGameSpeed(speed);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <div className="relative w-full h-screen">
        {!gameStarted ? (
          <GameMenu onStartGame={handleStartGame} />
        ) : (
          <SnakeGame speed={gameSpeed} onBackToMenu={handleBackToMenu} />
        )}
      </div>
    </div>
  );
};

export default Index;
