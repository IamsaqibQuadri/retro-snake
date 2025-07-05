
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { useTheme } from '../contexts/ThemeContext';
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
  // All hooks must be called in the same order every time
  const gameRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [foodEaten, setFoodEaten] = useState(false);
  const { theme } = useTheme();
  
  // useSnakeGame hook must be called consistently
  const { gameState, score, highScore, direction, gameOver, moveSnake, resetGame } = useSnakeGame(speed, gameMode);

  const GRID_SIZE = 20;
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 300;

  // Use design system tokens for consistent theming
  const backgroundClass = 'bg-background text-foreground';

  console.log('SnakeGame: Rendered with props:', { speed, gameMode, gameOver, score, highScore });
  console.log('SnakeGame: Game state:', { 
    snakeLength: gameState.snake.length, 
    foodPosition: gameState.food,
    currentDirection: direction 
  });

  // Memoize callbacks to prevent unnecessary re-renders
  const handleShowSettings = useCallback(() => {
    console.log('SnakeGame: Opening settings panel');
    setShowSettings(true);
  }, []);
  
  const handleCloseSettings = useCallback(() => {
    console.log('SnakeGame: Closing settings panel');
    setShowSettings(false);
  }, []);
  
  const handleNewGame = useCallback(() => {
    console.log('SnakeGame: Starting new game');
    resetGame();
  }, [resetGame]);

  const handleBackToMenu = useCallback(() => {
    console.log('SnakeGame: Going back to menu');
    onBackToMenu();
  }, [onBackToMenu]);

  // Watch for score changes to trigger food eaten effect
  useEffect(() => {
    if (score > 0) {
      console.log('SnakeGame: Score increased, triggering food eaten effect');
      setFoodEaten(true);
      const timer = setTimeout(() => setFoodEaten(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]);

  // Test game over scenario
  useEffect(() => {
    if (gameOver) {
      console.log('SnakeGame: Game over detected - Final score:', score, 'High score:', highScore);
      if (score === highScore && score > 0) {
        console.log('SnakeGame: NEW HIGH SCORE ACHIEVED!');
      }
    }
  }, [gameOver, score, highScore]);

  const takeScreenshot = useCallback(async () => {
    console.log('SnakeGame: Taking screenshot...');
    if (gameRef.current) {
      try {
        const canvas = await html2canvas(gameRef.current, {
          backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
          scale: 2,
        });
        
        const link = document.createElement('a');
        link.download = `snake-score-${score}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        console.log('SnakeGame: Screenshot saved successfully');
        toast({
          title: "Screenshot saved!",
          description: `Your score of ${score} has been captured!`,
        });
      } catch (error) {
        console.error('SnakeGame: Screenshot failed:', error);
        toast({
          title: "Screenshot failed",
          description: "Could not save screenshot. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [score, theme]);

  return (
    <div ref={gameRef} className={`flex flex-col items-center justify-center h-full px-4 transition-colors duration-300 ${backgroundClass}`}>
      <GameHeader
        score={score}
        highScore={highScore}
        gameMode={gameMode}
        onBackToMenu={handleBackToMenu}
        onShowSettings={handleShowSettings}
      />

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
          gameMode={gameMode}
          speed={speed}
          onNewGame={handleNewGame}
          onBackToMenu={handleBackToMenu}
          onTakeScreenshot={takeScreenshot}
        />
      </div>

      <GameInfo speed={speed} gameMode={gameMode} />

      {/* Mobile Controls */}
      <GameControls onDirectionChange={moveSnake} disabled={gameOver} />

      {/* Settings Panel */}
      <GameSettingsPanel 
        isOpen={showSettings} 
        onClose={handleCloseSettings} 
      />
    </div>
  );
};

export default React.memo(SnakeGame);
