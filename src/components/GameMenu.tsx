
import React, { useEffect, useState } from 'react';
import { Trophy, Gamepad2, Play, Crown, ArrowLeft } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'setup'>('welcome');
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
    console.log('GameMenu: High score loaded:', savedHighScore);
  }, []);

  const handleProceedToSetup = () => {
    console.log('GameMenu: Proceeding to setup screen');
    setCurrentStep('setup');
  };

  const handleBackToWelcome = () => {
    console.log('GameMenu: Going back to welcome screen');
    setCurrentStep('welcome');
    setSelectedSpeed(null);
  };

  const handleStartGame = () => {
    if (selectedSpeed) {
      console.log('GameMenu: Starting game with:', { speed: selectedSpeed, mode: gameMode });
      onStartGame(selectedSpeed, gameMode);
    }
  };

  const handleSpeedSelection = (speed: 'slow' | 'normal' | 'fast') => {
    console.log('GameMenu: Speed selected:', speed);
    setSelectedSpeed(speed);
  };

  const handleModeSelection = (mode: 'classic' | 'modern') => {
    console.log('GameMenu: Game mode selected:', mode);
    setGameMode(mode);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-4 text-center relative">
      {/* Enhanced Background Snake */}
      <BackgroundSnake />

      {/* Updated Watermark - Bottom Right */}
      <div className="absolute bottom-2 right-2 z-20 md:bottom-4 md:right-4">
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-2">
          <p className="text-green-400 text-xs font-bold">🐍 SNAKE RETRO</p>
          <p className="text-green-300 text-xs opacity-70">Classic Edition</p>
        </div>
      </div>

      {/* Content Container with higher z-index */}
      <div className="relative z-10 w-full max-w-md">
        {currentStep === 'welcome' ? (
          // Welcome Screen
          <>
            {/* Logo and Title with New Transparent Logo */}
            <div className="mb-8">
              <div className="relative">
                <img 
                  src="/lovable-uploads/fac2201e-f8a2-4cac-8ebc-c735a61174d1.png" 
                  alt="Snake Game Logo" 
                  className="w-64 md:w-80 h-auto mx-auto relative z-10 drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))',
                  }}
                />
              </div>
              
              <p className="text-green-300 text-sm tracking-wide mt-2 mb-1">🎮 Snake Retro Edition 🎮</p>
              <p className="text-green-200 text-xs tracking-wide">Fast. Offline. Classic fun</p>
            </div>

            {/* Start Game Button */}
            <div className="mb-8">
              <button
                onClick={handleProceedToSetup}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all duration-200 rounded-lg text-lg font-bold animate-pulse relative z-10"
              >
                <Play size={20} />
                <span>START GAME</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="text-green-300 text-xs space-y-1 mb-4">
              <p>🎮 Use arrow keys or control buttons</p>
              <p>🍎 Eat food to grow and score</p>
              <p>💀 Don't hit walls or yourself!</p>
              <p>📸 Take screenshot to save your score</p>
            </div>
          </>
        ) : (
          // Setup Screen
          <>
            {/* Back Button */}
            <div className="mb-6 flex justify-start">
              <button
                onClick={handleBackToWelcome}
                className="flex items-center gap-2 px-3 py-2 border border-green-400/50 bg-green-400/5 text-green-400 hover:bg-green-400/10 transition-all duration-200 rounded-lg text-sm"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>

            {/* High Score and Leaderboard */}
            <div className="mb-6 flex gap-2">
              {highScore > 0 && (
                <div className="flex-1 p-3 border-2 border-green-400 bg-green-400/10 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Trophy size={16} />
                    <span className="text-sm font-bold">HIGH: {highScore}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  console.log('GameMenu: Toggling leaderboard:', !showLeaderboard);
                  console.log('GameMenu: Current leaderboard entries:', leaderboard);
                  setShowLeaderboard(!showLeaderboard);
                }}
                className="px-3 py-2 border-2 border-purple-400 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all duration-200 rounded-lg"
              >
                <Crown size={16} />
              </button>
            </div>

            {/* Leaderboard */}
            {showLeaderboard && (
              <div className="mb-6 p-4 border-2 border-purple-400 bg-purple-400/10 rounded-lg">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Crown size={18} />
                  TOP 5 SCORES
                </h3>
                <Leaderboard entries={leaderboard} onClear={clearLeaderboard} />
              </div>
            )}

            {/* Game Mode Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-green-400 mb-4">GAME MODE</h2>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleModeSelection('classic')}
                  className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
                    gameMode === 'classic'
                      ? 'border-green-400 bg-green-400/20 text-green-400'
                      : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-green-400/50'
                  }`}
                >
                  🏛️ CLASSIC
                </button>
                <button
                  onClick={() => handleModeSelection('modern')}
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
            <div className="mb-6">
              <h2 className="text-lg font-bold text-green-400 mb-4">SELECT SPEED</h2>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleSpeedSelection('slow')}
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
                  onClick={() => handleSpeedSelection('normal')}
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
                  onClick={() => handleSpeedSelection('fast')}
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

            {/* Start Game Button */}
            {selectedSpeed && (
              <div className="mb-6">
                <button
                  onClick={handleStartGame}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-all duration-200 rounded-lg text-lg font-bold animate-pulse"
                >
                  <Gamepad2 size={20} />
                  <span>PLAY NOW</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameMenu;
