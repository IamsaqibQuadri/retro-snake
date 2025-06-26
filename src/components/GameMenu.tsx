
import React, { useEffect, useState } from 'react';
import { Trophy, Gamepad2, Palette } from 'lucide-react';
import { useGameSettings } from '../contexts/GameSettingsContext';

interface GameMenuProps {
  onStartGame: (speed: 'slow' | 'normal' | 'fast') => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [highScore, setHighScore] = useState(0);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const { settings, setSnakeColors } = useGameSettings();

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const colorPresets = [
    { name: 'Classic Green', head: '#22c55e', body: '#16a34a' },
    { name: 'Blue Ocean', head: '#3b82f6', body: '#1d4ed8' },
    { name: 'Purple Magic', head: '#a855f7', body: '#7c3aed' },
    { name: 'Red Fire', head: '#ef4444', body: '#dc2626' },
    { name: 'Orange Sunset', head: '#f97316', body: '#ea580c' },
    { name: 'Pink Rose', head: '#ec4899', body: '#db2777' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-4 text-center">
      {/* Updated Title Section with Snake Graphic */}
      <div className="mb-8 relative">
        {/* Snake graphic wrapping around FLAKY */}
        <div className="relative">
          <img 
            src="/lovable-uploads/44193645-44f1-4e15-a2e2-d159c9d14367.png" 
            alt="FLAKY Snake Logo" 
            className="w-80 md:w-96 h-auto mx-auto"
          />
        </div>
        
        <div className="flex items-center justify-center gap-2 text-green-300 mb-2 mt-4">
          <Gamepad2 size={16} />
          <span className="text-sm tracking-widest">SNAKE RETRO EDITION</span>
          <Gamepad2 size={16} />
        </div>
        <p className="text-green-200 text-xs tracking-wide">Fast. Offline. Classic fun</p>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="mb-6 p-3 border-2 border-green-400 bg-green-400/10 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Trophy size={16} />
            <span className="text-md font-bold">HIGH SCORE: {highScore}</span>
          </div>
        </div>
      )}

      {/* Compact Speed Selection - Square Buttons */}
      <div className="mb-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-green-400 mb-4">SELECT SPEED</h2>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onStartGame('slow')}
            className="w-20 h-20 text-sm font-bold border-2 border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all duration-200 rounded-lg flex flex-col items-center justify-center"
          >
            <span className="text-lg">🐌</span>
            <span className="text-xs">SLOW</span>
          </button>
          
          <button
            onClick={() => onStartGame('normal')}
            className="w-20 h-20 text-sm font-bold border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-all duration-200 rounded-lg flex flex-col items-center justify-center"
          >
            <span className="text-lg">🏃</span>
            <span className="text-xs">NORMAL</span>
          </button>
          
          <button
            onClick={() => onStartGame('fast')}
            className="w-20 h-20 text-sm font-bold border-2 border-red-400 bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all duration-200 rounded-lg flex flex-col items-center justify-center"
          >
            <span className="text-lg">🚀</span>
            <span className="text-xs">FAST</span>
          </button>
        </div>
      </div>

      {/* Compact Snake Color Selector */}
      <div className="mb-6 w-full max-w-md">
        <button
          onClick={() => setShowColorSelector(!showColorSelector)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 border-2 border-purple-400 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all duration-200 rounded-lg text-sm"
        >
          <Palette size={16} />
          <span className="font-bold">SNAKE COLOR</span>
        </button>
        
        {showColorSelector && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setSnakeColors(preset.head, preset.body);
                  setShowColorSelector(false);
                }}
                className={`p-2 border-2 rounded-lg transition-colors text-left ${
                  settings.snakeColor === preset.head
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-gray-600 hover:border-green-400/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: preset.head }}
                  />
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: preset.body }}
                  />
                </div>
                <span className="text-xs text-green-300">{preset.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Compact Instructions */}
      <div className="text-green-300 text-xs space-y-1 max-w-md">
        <p>🎮 Use SWIPE or arrow buttons to control</p>
        <p>🍎 Eat food to grow and score</p>
        <p>💀 Don't hit walls or yourself!</p>
        <p>📸 Screenshot your score when done</p>
      </div>
    </div>
  );
};

export default GameMenu;
