
import React, { useRef, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import GameControls from './GameControls';
import GameSettingsPanel from './GameSettingsPanel';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GameInfo from './GameInfo';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface SnakeGameProps {
  speed: 'slow' | 'normal' | 'fast';
  gameMode: 'classic' | 'modern';
  onBackToMenu: () => void;
}

const SnakeGame = ({ speed, gameMode, onBackToMenu }: SnakeGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const { gameState, score, highScore, direction, gameOver, moveSnake, resetGame } = useSnakeGame(speed, gameMode);
  const [showSettings, setShowSettings] = useState(false);
  const [foodEaten, setFoodEaten] = useState(false);

  const GRID_SIZE = 20;
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 300;

  // Watch for score changes to trigger food eaten effect
  useEffect(() => {
    if (score > 0) {
      setFoodEaten(true);
      const timer = setTimeout(() => setFoodEaten(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]);

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
      <GameHeader
        score={score}
        highScore={highScore}
        gameMode={gameMode}
        onBackToMenu={onBackToMenu}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* Screenshot Button */}
      <div className="mb-3">
        <button
          onClick={takeScreenshot}
          className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors rounded-lg font-bold text-sm"
        >
          <Camera size={18} />
          <span>SCREENSHOT</span>
        </button>
      </div>

      {/* Game Board with Overlay */}
      <div className="relative">
        <GameBoard
          snake={gameState.snake}
          food={gameState.food}
          direction={direction}
          foodEaten={foodEaten}
          gameWidth={GAME_WIDTH}
          gameHeight={GAME_HEIGHT}
          gridSize={GRID_SIZE}
        />
        
        <GameOverlay
          gameOver={gameOver}
          score={score}
          highScore={highScore}
          onNewGame={handleNewGame}
          onBackToMenu={onBackToMenu}
          onTakeScreenshot={takeScreenshot}
        />
      </div>

      <GameInfo speed={speed} gameMode={gameMode} />

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
