
import React, { useEffect, useState } from 'react';

interface GameCountdownProps {
  onCountdownComplete: () => void;
  gameMode: 'classic' | 'modern';
  speed: 'slow' | 'normal' | 'fast';
}

const GameCountdown = ({ onCountdownComplete, gameMode, speed }: GameCountdownProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onCountdownComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCountdownComplete]);

  const getSpeedEmoji = (speed: string) => {
    switch (speed) {
      case 'slow': return '🐌';
      case 'normal': return '🏃';
      case 'fast': return '🚀';
      default: return '⚡';
    }
  };

  const getModeEmoji = (mode: string) => {
    return mode === 'classic' ? '🏛️' : '🌐';
  };

  if (count === 0) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-green-400 animate-pulse mb-4">
            GO!
          </div>
          <div className="text-green-300 text-lg">
            {getModeEmoji(gameMode)} {gameMode.toUpperCase()} • {getSpeedEmoji(speed)} {speed.toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-8xl md:text-9xl font-bold text-green-400 animate-pulse mb-6">
          {count}
        </div>
        <div className="text-green-300 text-xl mb-4">Get Ready!</div>
        <div className="text-green-300 text-lg">
          {getModeEmoji(gameMode)} {gameMode.toUpperCase()} • {getSpeedEmoji(speed)} {speed.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default GameCountdown;
