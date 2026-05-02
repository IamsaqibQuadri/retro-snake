import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';
import GameControls from './GameControls';
import GameSettingsPanel from './GameSettingsPanel';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GameInfo from './GameInfo';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useGlobalLeaderboard } from '@/hooks/useGlobalLeaderboard';

interface SnakeGameProps {
  speed: 'slow' | 'normal' | 'fast';
  gameMode: GameMode;
  onBackToMenu: () => void;
}

const SnakeGame = ({ speed, gameMode, onBackToMenu }: SnakeGameProps) => {
  // All hooks must be called in the same order every time
  const gameRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [foodEaten, setFoodEaten] = useState(false);
  const [scoreSessionToken, setScoreSessionToken] = useState<string | null>(null);
  const { theme } = useTheme();
  const { startScoreSession } = useGlobalLeaderboard();
  
  // useSnakeGame hook must be called consistently
  const { gameState, score, highScore, direction, gameOver, moveSnake, resetGame, chaosState, timeAttackState, survivalState } = useSnakeGame(speed, gameMode);

  const GRID_SIZE = 20;
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 300;

  // Use design system tokens for consistent theming
  const backgroundClass = 'bg-background text-foreground';

  logger.log('SnakeGame: Rendered with props:', { speed, gameMode, gameOver, score, highScore });
  logger.log('SnakeGame: Game state:', { 
    snakeLength: gameState.snake.length, 
    foodPosition: gameState.food,
    currentDirection: direction 
  });

  // Memoize callbacks to prevent unnecessary re-renders
  const handleShowSettings = useCallback(() => {
    logger.log('SnakeGame: Opening settings panel');
    setShowSettings(true);
  }, []);
  
  const handleCloseSettings = useCallback(() => {
    logger.log('SnakeGame: Closing settings panel');
    setShowSettings(false);
  }, []);

  const beginScoreSession = useCallback(async () => {
    setScoreSessionToken(null);
    const result = await startScoreSession(gameMode, speed);
    if (result.success && result.sessionToken) {
      setScoreSessionToken(result.sessionToken);
    }
  }, [gameMode, speed, startScoreSession]);

  useEffect(() => {
    beginScoreSession();
  }, [beginScoreSession]);
  
  const handleNewGame = useCallback(() => {
    logger.log('SnakeGame: Starting new game');
    resetGame();
    beginScoreSession();
  }, [resetGame, beginScoreSession]);

  const handleBackToMenu = useCallback(() => {
    logger.log('SnakeGame: Going back to menu');
    onBackToMenu();
  }, [onBackToMenu]);

  // Watch for score changes to trigger food eaten effect
  useEffect(() => {
    if (score > 0) {
      logger.log('SnakeGame: Score increased, triggering food eaten effect');
      setFoodEaten(true);
      const timer = setTimeout(() => setFoodEaten(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score]);

  // Test game over scenario
  useEffect(() => {
    if (gameOver) {
      logger.log('SnakeGame: Game over detected - Final score:', score, 'High score:', highScore);
      if (score === highScore && score > 0) {
        logger.log('SnakeGame: NEW HIGH SCORE ACHIEVED!');
      }
    }
  }, [gameOver, score, highScore]);

  const takeScreenshot = useCallback(async () => {
    logger.log('SnakeGame: Taking screenshot...');
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
        
        logger.log('SnakeGame: Screenshot saved successfully');
        toast({
          title: "Screenshot saved!",
          description: `Your score of ${score} has been captured!`,
        });
      } catch (error) {
        logger.error('SnakeGame: Screenshot failed:', error);
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
        chaosPhase={chaosState?.phase}
        chaosElapsedTime={chaosState?.elapsedTime}
        chaosPhaseLabel={chaosState?.phaseLabel}
        timeAttackRemaining={timeAttackState?.timeRemaining}
        survivalSpeedMultiplier={survivalState?.speedMultiplier}
        survivalFoodsEaten={survivalState?.foodsEaten}
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
          obstacles={chaosState?.obstacles}
        />
        
        <GameOverlay
          gameOver={gameOver}
          score={score}
          highScore={highScore}
          gameMode={gameMode}
          speed={speed}
          scoreSessionToken={scoreSessionToken}
          onNewGame={handleNewGame}
          onBackToMenu={handleBackToMenu}
          onTakeScreenshot={takeScreenshot}
        />
      </div>

      {/* Only show GameInfo and Controls when game is NOT over */}
      {!gameOver && (
        <>
          <GameInfo 
            speed={speed} 
            gameMode={gameMode} 
            chaosPhase={chaosState?.phase}
            survivalSpeedMultiplier={survivalState?.speedMultiplier}
          />

          {/* Mobile Controls */}
          <GameControls onDirectionChange={moveSnake} disabled={gameOver} />
        </>
      )}

      {/* Settings Panel */}
      <GameSettingsPanel 
        isOpen={showSettings} 
        onClose={handleCloseSettings} 
      />
    </div>
  );
};

export default React.memo(SnakeGame);
