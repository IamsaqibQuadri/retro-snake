
import React, { useEffect, useState } from 'react';
import { Trophy, Gamepad2, Palette, Play } from 'lucide-react';
import { useGameSettings } from '../contexts/GameSettingsContext';

interface GameMenuProps {
  onStartGame: (speed: 'slow' | 'normal' | 'fast', gameMode: 'classic' | 'modern') => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [highScore, setHighScore] = useState(0);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast' | null>(null);
  const [gameMode, setGameMode] = useState<'classic' | 'modern'>('classic');
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

  const handleStartGame = () => {
    if (selectedSpeed) {
      onStartGame(selectedSpeed, gameMode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-4 text-center relative">
      {/* Developer Stamp - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="relative">
          {/* Stamp border */}
          <div className="border-2 border-green-400/60 border-dashed rounded-lg p-3 bg-black/80 backdrop-blur-sm transform rotate-[-2deg]">
            <div className="text-center">
              <div className="text-xs font-bold text-green-400 tracking-wider">MADE BY</div>
              <div className="text-lg font-bold text-green-300 tracking-wide">SAQIB</div>
              <div className="text-xs text-green-400/80 mt-1">★ 2024 ★</div>
            </div>
          </div>
          {/* Stamp perforations effect */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border border-green-400/40 rounded-full bg-black"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border border-green-400/40 rounded-full bg-black"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-green-400/40 rounded-full bg-black"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-green-400/40 rounded-full bg-black"></div>
        </div>
      </div>

      {/* Title Section with Snake Graphic */}
      <div className="mb-8 relative">
        <div className="relative">
          <img 
            src="/lovable-uploads/44193645-44f1-4e15-a2e2-d159c9d14367.png" 
            alt="FLAKY Logo" 
            className="w-80 md:w-96 h-auto mx-auto"
            style={{
              filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(2px 2px 0 #000) drop-shadow(3px 3px 0 #000)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          />
          {/* Add more black dots overlay for enhanced sprinkling effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full relative">
              <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-black rounded-full opacity-60"></div>
              <div className="absolute top-[35%] left-[25%] w-1 h-1 bg-black rounded-full opacity-50"></div>
              <div className="absolute top-[45%] left-[18%] w-1 h-1 bg-black rounded-full opacity-70"></div>
              <div className="absolute top-[25%] left-[45%] w-1 h-1 bg-black rounded-full opacity-60"></div>
              <div className="absolute top-[55%] left-[35%] w-1 h-1 bg-black rounded-full opacity-50"></div>
              <div className="absolute top-[30%] left-[65%] w-1 h-1 bg-black rounded-full opacity-70"></div>
              <div className="absolute top-[50%] left-[70%] w-1 h-1 bg-black rounded-full opacity-60"></div>
              <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-black rounded-full opacity-50"></div>
              <div className="absolute top-[20%] left-[75%] w-1 h-1 bg-black rounded-full opacity-70"></div>
              <div className="absolute top-[60%] left-[55%] w-1 h-1 bg-black rounded-full opacity-60"></div>
              {/* Additional dots for more sprinkling effect */}
              <div className="absolute top-[15%] left-[35%] w-1 h-1 bg-black rounded-full opacity-55"></div>
              <div className="absolute top-[65%] left-[25%] w-1 h-1 bg-black rounded-full opacity-65"></div>
              <div className="absolute top-[10%] left-[55%] w-1 h-1 bg-black rounded-full opacity-60"></div>
              <div className="absolute top-[70%] left-[45%] w-1 h-1 bg-black rounded-full opacity-50"></div>
              <div className="absolute top-[32%] left-[85%] w-1 h-1 bg-black rounded-full opacity-65"></div>
              <div className="absolute top-[58%] left-[80%] w-1 h-1 bg-black rounded-full opacity-55"></div>
              <div className="absolute top-[12%] left-[22%] w-1 h-1 bg-black rounded-full opacity-60"></div>
              <div className="absolute top-[68%] left-[65%] w-1 h-1 bg-black rounded-full opacity-70"></div>
              <div className="absolute top-[28%] left-[12%] w-1 h-1 bg-black rounded-full opacity-50"></div>
              <div className="absolute top-[52%] left-[88%] w-1 h-1 bg-black rounded-full opacity-65"></div>
              <div className="absolute top-[38%] left-[38%] w-1 h-1 bg-black rounded-full opacity-55"></div>
              <div className="absolute top-[62%] left-[72%] w-1 h-1 bg-black rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        <p className="text-green-200 text-xs tracking-wide mt-4">Fast. Offline. Classic fun</p>
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

      {/* Snake Color Selector */}
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

      {/* Instructions */}
      <div className="text-green-300 text-xs space-y-1 max-w-md">
        <p>🎮 Use SWIPE or arrow buttons to control</p>
        <p>🍎 Eat food to grow and score</p>
        <p>💀 Don't hit walls or yourself!</p>
        <p>📸 Take screenshot to save your score</p>
      </div>
    </div>
  );
};

export default GameMenu;
