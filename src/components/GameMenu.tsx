
import React, { useEffect, useState } from 'react';
import { Trophy, Gamepad2 } from 'lucide-react';

interface GameMenuProps {
  onStartGame: (speed: 'slow' | 'normal' | 'fast') => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      {/* Retro Title */}
      <div className="mb-12">
        <h1 className="text-6xl md:text-8xl font-bold text-green-400 mb-4 tracking-wider pixelated">
          SNAKE
        </h1>
        <div className="flex items-center justify-center gap-2 text-green-300">
          <Gamepad2 size={24} />
          <span className="text-xl tracking-widest">RETRO EDITION</span>
          <Gamepad2 size={24} />
        </div>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="mb-8 p-4 border-2 border-green-400 bg-green-400/10 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Trophy size={20} />
            <span className="text-lg font-bold">HIGH SCORE: {highScore}</span>
          </div>
        </div>
      )}

      {/* Speed Selection */}
      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-400 mb-6">SELECT SPEED</h2>
        
        <button
          onClick={() => onStartGame('slow')}
          className="w-full py-4 px-8 text-xl font-bold border-2 border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all duration-200 rounded-lg tracking-wide"
        >
          🐌 SLOW MODE
        </button>
        
        <button
          onClick={() => onStartGame('normal')}
          className="w-full py-4 px-8 text-xl font-bold border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-all duration-200 rounded-lg tracking-wide"
        >
          🏃 NORMAL MODE
        </button>
        
        <button
          onClick={() => onStartGame('fast')}
          className="w-full py-4 px-8 text-xl font-bold border-2 border-red-400 bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all duration-200 rounded-lg tracking-wide"
        >
          🚀 FAST MODE
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-12 text-green-300 text-sm space-y-2 max-w-md">
        <p>🎮 Use SWIPE gestures or arrow buttons to control the snake</p>
        <p>🍎 Eat food to grow and increase your score</p>
        <p>💀 Don't hit walls or yourself!</p>
        <p>📸 Screenshot your score when you finish</p>
      </div>
    </div>
  );
};

export default GameMenu;
