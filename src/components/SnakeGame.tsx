import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode, GameSpeed } from '../types/gameTypes';
import GameControls from './GameControls';
import LazyGameSettingsPanel from './LazyGameSettingsPanel';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GameInfo from './GameInfo';
import OceanBackground from './backgrounds/OceanBackground';
import MatrixBackground from './backgrounds/MatrixBackground';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface SnakeGameProps {
  speed: GameSpeed;
  gameMode: GameMode;
  onBackToMenu: () => void;
}

const SnakeGame = ({ speed, gameMode, onBackToMenu }: SnakeGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [foodEaten, setFoodEaten] = useState(false);
  const { theme } = useTheme();
  
  const { 
    gameState, 
    score, 
    highScore, 
    direction, 
    gameOver, 
    moveSnake, 
    resetGame, 
    timeRemaining, 
    speedLevel,
    chaosPhase,
    chaosElapsedTime,
    chaosPhaseNumber 
  } = useSnakeGame(speed, gameMode);

  const GRID_SIZE = 20;
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 300;

  const backgroundClass = 'bg-background text-foreground';

  const handleShowSettings = useCallback(() => {
    setShowSettings(true);
  }, []);
  
  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);
  
  const handleNewGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleBackToMenu = useCallback(() => {
    onBackToMenu();
  }, [onBackToMenu]);

  // Food eaten effect
  useEffect(() => {
    if (score > 0) {
      setFoodEaten(true);
      const timer = setTimeout(() => setFoodEaten(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]);

  const takeScreenshot = useCallback(async () => {
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
  }, [score, theme]);

  return (
    <div ref={gameRef} className={`relative flex flex-col items-center justify-center h-full px-4 transition-colors duration-300 ${backgroundClass}`}>
      {/* Themed backgrounds - z-0 to stay behind content */}
      {theme === 'ocean' && <OceanBackground />}
      {theme === 'matrix' && <MatrixBackground />}
      
      {/* Game content wrapper - z-10 to stay above backgrounds */}
      <div className="relative z-10 flex flex-col items-center">
        <GameHeader
          score={score}
          highScore={highScore}
          gameMode={gameMode}
          onBackToMenu={handleBackToMenu}
          onShowSettings={handleShowSettings}
          timeRemaining={timeRemaining}
          speedLevel={speedLevel}
          chaosPhase={chaosPhase}
          chaosElapsedTime={chaosElapsedTime}
        />

        <div className="relative">
          <GameBoard
            snake={gameState.snake}
            food={gameState.food}
            direction={direction}
            foodEaten={foodEaten}
            gameWidth={GAME_WIDTH}
            gameHeight={GAME_HEIGHT}
            gridSize={GRID_SIZE}
            obstacles={gameState.obstacles || []}
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

        <GameInfo speed={speed} gameMode={gameMode} chaosPhase={chaosPhaseNumber} />

        <GameControls onDirectionChange={moveSnake} disabled={gameOver} />

        <LazyGameSettingsPanel 
          isOpen={showSettings} 
          onClose={handleCloseSettings} 
        />
      </div>
    </div>
  );
};

export default React.memo(SnakeGame);
