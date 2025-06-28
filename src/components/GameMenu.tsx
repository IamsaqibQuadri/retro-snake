
import React, { useEffect, useState } from 'react';
import { Trophy, Gamepad2, Play, Crown } from 'lucide-react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useLeaderboard } from '../hooks/useLeaderboard';
import BackgroundSnake from './BackgroundSnake';
import Leaderboard from './Leaderboard';

interface GameMenuProps {
  onStartGame: (speed: 'slow' | 'normal' | 'fast', gameMode: 'classic' | 'modern') => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [highScore, setHighScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast' | null>(null);
  const [gameMode, setGameMode] = useState<'classic' | 'modern'>('classic');
  const { settings } = useGameSettings();
  const { leaderboard, clearLeaderboard } = useLeaderboard();

  // Background music
  useBackgroundMusic(true);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const handleStartGame = () => {
    if (selectedSpeed) {
      onStartGame(selectedSpeed, gameMode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-4 text-center relative">
      {/* Animated Background Snake */}
      <BackgroundSnake />

      {/* Watermark - Bottom Right with better positioning */}
      <div className="absolute bottom-2 right-2 z-10 md:bottom-4 md:right-4">
        <img 
          src="/lovable-uploads/497fd7e1-4d9e-449f-8fd9-bc8c8c52ea9a.png" 
          alt="Made by Saqib" 
          className="w-12 h-12 md:w-16 md:h-16 opacity-80"
        />
      </div>

      {/* Title Section with New Snake Logo */}
      <div className="mb-8 relative">
        <div className="relative">
          <img 
            src="/lovable-uploads/a97eb904-18bb-40d7-b927-eb29b333e690.png" 
            alt="Snake Game Logo" 
            className="w-64 md:w-80 h-auto mx-auto"
            style={{
              filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(2px 2px 0 #000) drop-shadow(3px 3px 0 #000)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          />
        </div>
        
        <p className="text-green-300 text-sm tracking-wide mt-2 mb-1">🎮 Snake Retro Edition 🎮</p>
        <p className="text-green-200 text-xs tracking-wide">Fast. Offline. Classic fun</p>
      </div>

      {/* High Score and Leaderboard Toggle */}
      <div className="mb-6 flex gap-2 w-full max-w-md">
        {highScore > 0 && (
          <div className="flex-1 p-3 border-2 border-green-400 bg-green-400/10 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Trophy size={16} />
              <span className="text-sm font-bold">HIGH: {highScore}</span>
            </div>
          </div>
        )}
        
        {leaderboard.length > 0 && (
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-3 py-2 border-2 border-purple-400 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all duration-200 rounded-lg"
          >
            <Crown size={16} />
          </button>
        )}
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="mb-6 w-full max-w-md p-4 border-2 border-purple-400 bg-purple-400/10 rounded-lg">
          <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Crown size={18} />
            TOP 5 SCORES
          </h3>
          <Leaderboard entries={leaderboard} onClear={clearLeaderboard} />
        </div>
      )}

      {/* Game Mode Toggle */}
      <div className="mb-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-green-400 mb-4">GAME MODE</h2>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setGameMode('classic')}
            className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
              gameMode === 'classic'
                ? 'border-green-400 bg-green-400/20 text-green-400'
                : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-green-400/50'
            }`}
          >
            🏛️ CLASSIC
          </button>
          <button
            onClick={() => setGameMode('modern')}
            className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
              gameMode === 'modern'
                ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-blue-400/50'
            }`}
          >
            🌐 MODERN
          </button>
        </div>
      </div>

      {/* Speed Selection */}
      <div className="mb-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-green-400 mb-4">SELECT SPEED</h2>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelectedSpeed('slow')}
            className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
              selectedSpeed === 'slow'
                ? 'border-green-400 bg-green-400/20 text-green-400'
                : 'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20'
            }`}
          >
            <span className="text-lg">🐌</span>
            <span className="text-xs">SLOW</span>
          </button>
          
          <button
            onClick={() => setSelectedSpeed('normal')}
            className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
              selectedSpeed === 'normal'
                ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                : 'border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
            }`}
          >
            <span className="text-lg">🏃</span>
            <span className="text-xs">NORMAL</span>
          </button>
          
          <button
            onClick={() => setSelectedSpeed('fast')}
            className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
              selectedSpeed === 'fast'
                ? 'border-red-400 bg-red-400/20 text-red-400'
                : 'border-red-400 bg-red-400/10 text-red-400 hover:bg-red-400/20'
            }`}
          >
            <span className="text-lg">🚀</span>
            <span className="text-xs">FAST</span>
          </button>
        </div>
      </div>

      {/* Start Button */}
      {selectedSpeed && (
        <div className="mb-6 w-full max-w-md">
          <button
            onClick={handleStartGame}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all duration-200 rounded-lg text-lg font-bold animate-pulse"
          >
            <Play size={20} />
            <span>START GAME</span>
          </button>
        </div>
      )}

      {/* Instructions - moved higher up to avoid watermark overlap */}
      <div className="text-green-300 text-xs space-y-1 max-w-md mb-4">
        <p>🎮 Use SWIPE or arrow buttons to control</p>
        <p>🍎 Eat food to grow and score</p>
        <p>💀 Don't hit walls or yourself!</p>
        <p>📸 Take screenshot to save your score</p>
      </div>
    </div>
  );
};

export default GameMenu;
