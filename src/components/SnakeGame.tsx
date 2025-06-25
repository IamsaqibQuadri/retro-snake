
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Camera, Home, Settings } from 'lucide-react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { useGameSettings } from '../contexts/GameSettingsContext';
import GameControls from './GameControls';
import GameSettingsPanel from './GameSettingsPanel';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface SnakeGameProps {
  speed: 'slow' | 'normal' | 'fast';
  onBackToMenu: () => void;
}

const SnakeGame = ({ speed, onBackToMenu }: SnakeGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const { gameState, score, highScore, direction, gameOver, moveSnake, resetGame } = useSnakeGame(speed);
  const { settings } = useGameSettings();
  const [showSettings, setShowSettings] = useState(false);

  const GRID_SIZE = 20;
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 300;

  const takeScreenshot = async () => {
    if (gameRef.current) {
      try {
        const canvas = await html2canvas(gameRef.current, {
          backgroundColor: '#000000',
          scale: 2,
        });
        
        const link = document.createElement('a');
        link.download = `snake-score-${score}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Screenshot saved!",
          description: `Your score of ${score} has been captured!`,
        });
      } catch (error) {
        toast({
          title: "Screenshot failed",
          description: "Could not save screenshot. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewGame = () => {
    resetGame();
  };

  // Snake head with tongue effect
  const renderSnakeHead = (segment: any, index: number) => {
    const tongueOffset = 8; // pixels
    let tongueStyle: React.CSSProperties = {};
    
    // Position tongue based on direction
    switch (direction) {
      case 'UP':
        tongueStyle = { top: -4, left: '50%', transform: 'translateX(-50%)', width: 2, height: 6 };
        break;
      case 'DOWN':
        tongueStyle = { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 2, height: 6 };
        break;
      case 'LEFT':
        tongueStyle = { left: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 2 };
        break;
      case 'RIGHT':
        tongueStyle = { right: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 2 };
        break;
    }

    return (
      <div
        key={index}
        className="absolute"
        style={{
          left: segment.x * GRID_SIZE,
          top: segment.y * GRID_SIZE,
          width: GRID_SIZE,
          height: GRID_SIZE,
          backgroundColor: settings.snakeColor,
          position: 'relative',
          background: `linear-gradient(45deg, ${settings.snakeColor} 0%, ${settings.snakeColor} 40%, #000 45%, ${settings.snakeColor} 50%, #000 55%, ${settings.snakeColor} 60%, ${settings.snakeColor} 100%)`,
        }}
      >
        {/* Snake tongue */}
        <div
          className="absolute bg-red-500 animate-pulse"
          style={tongueStyle}
        />
      </div>
    );
  };

  // Snake body with tattoo pattern
  const renderSnakeBody = (segment: any, index: number) => (
    <div
      key={index}
      className="absolute"
      style={{
        left: segment.x * GRID_SIZE,
        top: segment.y * GRID_SIZE,
        width: GRID_SIZE,
        height: GRID_SIZE,
        backgroundColor: settings.snakeBodyColor,
        background: `linear-gradient(45deg, ${settings.snakeBodyColor} 0%, ${settings.snakeBodyColor} 30%, #000 35%, ${settings.snakeBodyColor} 40%, #000 45%, ${settings.snakeBodyColor} 50%, #000 55%, ${settings.snakeBodyColor} 60%, #000 65%, ${settings.snakeBodyColor} 70%, ${settings.snakeBodyColor} 100%)`,
      }}
    />
  );

  return (
    <div ref={gameRef} className="flex flex-col items-center justify-center h-full px-4 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1 px-2 py-2 border border-green-400 text-green-400 hover:bg-green-400/10 transition-colors rounded text-sm"
        >
          <Home size={16} />
          <span className="text-xs">Menu</span>
        </button>
        
        <div className="text-center">
          <div className="text-green-400 font-bold text-lg">SCORE: {score}</div>
          <div className="text-green-300 text-xs">HIGH: {highScore}</div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 px-2 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition-colors rounded text-xs"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Prominent Screenshot Button */}
      <div className="mb-3">
        <button
          onClick={takeScreenshot}
          className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors rounded-lg font-bold text-sm"
        >
          <Camera size={18} />
          <span>SCREENSHOT</span>
        </button>
      </div>

      {/* Game Board */}
      <div className="relative border-2 border-green-400 bg-black rounded-lg overflow-hidden" 
           style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        
        {/* Snake */}
        {gameState.snake.map((segment, index) => 
          index === 0 ? renderSnakeHead(segment, index) : renderSnakeBody(segment, index)
        )}

        {/* Food */}
        <div
          className="absolute bg-red-400 rounded-full animate-pulse"
          style={{
            left: gameState.food.x * GRID_SIZE,
            top: gameState.food.y * GRID_SIZE,
            width: GRID_SIZE,
            height: GRID_SIZE,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-xl font-bold text-red-400 mb-2">GAME OVER</h2>
            <p className="text-green-400 text-lg mb-2">Score: {score}</p>
            {score === highScore && score > 0 && (
              <p className="text-yellow-400 text-sm mb-3">🏆 NEW HIGH SCORE!</p>
            )}
            <p className="text-green-300 text-xs mb-4">Try again or give up?</p>
            <div className="space-y-2">
              <button
                onClick={handleNewGame}
                className="block w-full px-4 py-2 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors text-sm"
              >
                TRY AGAIN
              </button>
              <button
                onClick={onBackToMenu}
                className="block w-full px-4 py-2 border border-red-400 text-red-400 font-bold rounded hover:bg-red-400/10 transition-colors text-sm"
              >
                GIVE UP
              </button>
              <button
                onClick={takeScreenshot}
                className="block w-full px-4 py-2 border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400 font-bold rounded hover:bg-yellow-400/20 transition-colors text-sm"
              >
                📸 SAVE SCORE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Speed Indicator */}
      <div className="mt-3 text-center">
        <span className="text-green-300 text-xs">
          {speed === 'slow' ? '🐌 SLOW' : speed === 'normal' ? '🏃 NORMAL' : '🚀 FAST'} MODE
        </span>
      </div>

      {/* Mobile Controls */}
      <GameControls onDirectionChange={moveSnake} disabled={gameOver} />

      {/* Settings Panel */}
      <GameSettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default SnakeGame;
