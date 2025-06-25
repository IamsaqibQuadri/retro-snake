
import React, { useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Home } from 'lucide-react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import GameControls from './GameControls';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface SnakeGameProps {
  speed: 'slow' | 'normal' | 'fast';
  onBackToMenu: () => void;
}

const SnakeGame = ({ speed, onBackToMenu }: SnakeGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const { gameState, score, highScore, direction, gameOver, moveSnake, resetGame } = useSnakeGame(speed);

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

  return (
    <div ref={gameRef} className="flex flex-col items-center justify-center h-full px-4 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400/10 transition-colors rounded"
        >
          <Home size={16} />
          <span className="hidden sm:inline">Menu</span>
        </button>
        
        <div className="text-center">
          <div className="text-green-400 font-bold text-xl">SCORE: {score}</div>
          <div className="text-green-300 text-sm">HIGH: {highScore}</div>
        </div>
        
        <button
          onClick={takeScreenshot}
          className="flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 transition-colors rounded"
        >
          <Camera size={16} />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* Game Board */}
      <div className="relative border-2 border-green-400 bg-black rounded-lg overflow-hidden" 
           style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        
        {/* Snake */}
        {gameState.snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-400' : 'bg-green-500'} border border-green-300`}
            style={{
              left: segment.x * GRID_SIZE,
              top: segment.y * GRID_SIZE,
              width: GRID_SIZE - 1,
              height: GRID_SIZE - 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-400 border border-red-300 rounded-full animate-pulse"
          style={{
            left: gameState.food.x * GRID_SIZE,
            top: gameState.food.y * GRID_SIZE,
            width: GRID_SIZE - 1,
            height: GRID_SIZE - 1,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-3xl font-bold text-red-400 mb-4">GAME OVER</h2>
            <p className="text-green-400 text-xl mb-2">Score: {score}</p>
            {score === highScore && score > 0 && (
              <p className="text-yellow-400 text-lg mb-4">🏆 NEW HIGH SCORE!</p>
            )}
            <div className="space-y-3">
              <button
                onClick={handleNewGame}
                className="block w-full px-6 py-3 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={takeScreenshot}
                className="block w-full px-6 py-3 border border-yellow-400 text-yellow-400 font-bold rounded hover:bg-yellow-400/10 transition-colors"
              >
                📸 SAVE SCORE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Speed Indicator */}
      <div className="mt-4 text-center">
        <span className="text-green-300 text-sm">
          {speed === 'slow' ? '🐌 SLOW' : speed === 'normal' ? '🏃 NORMAL' : '🚀 FAST'} MODE
        </span>
      </div>

      {/* Mobile Controls */}
      <GameControls onDirectionChange={moveSnake} disabled={gameOver} />
    </div>
  );
};

export default SnakeGame;
