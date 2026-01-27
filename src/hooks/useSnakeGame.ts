
import { useEffect, useCallback, useRef, useMemo } from 'react';
import { GameSpeed, GameMode, Position, ChaosState } from '../types/gameTypes';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { useGameSounds } from './useGameSounds';
import { useLeaderboard } from './useLeaderboard';
import { useChaosMode } from './useChaosMode';
import { generateFood, checkWallCollision, checkSelfCollision, getNewHeadPosition, wrapAroundWalls, checkObstacleCollision } from '../utils/gameUtils';
import { SPEED_INTERVALS } from '../constants/gameConstants';

export const useSnakeGame = (speed: GameSpeed, gameMode: GameMode = 'classic') => {
  const {
    gameState,
    gameOver,
    isPlaying,
    directionRef,
    updateGameState,
    moveSnake,
    resetGame: resetGameState,
    togglePause,
    endGame,
  } = useGameState();

  const { score, highScore, increaseScore, resetScore } = useGameScore();
  const { playEatSound, playGameOverSound } = useGameSounds();
  const { addScore } = useLeaderboard();

  // Track if score has been added to prevent duplicates
  const scoreAddedRef = useRef(false);
  
  // Refs for chaos mode to avoid stale closures
  const snakeRef = useRef<Position[]>(gameState.snake);
  const foodRef = useRef<Position>(gameState.food);
  
  // Keep refs updated
  useEffect(() => {
    snakeRef.current = gameState.snake;
    foodRef.current = gameState.food;
  }, [gameState.snake, gameState.food]);

  // Chaos mode hook
  const chaosMode = useChaosMode(
    isPlaying && gameMode === 'chaos',
    gameOver,
    () => snakeRef.current,
    () => foodRef.current
  );

  // Memoize speed interval with chaos mode speed multiplier
  const speedInterval = useMemo(() => {
    const baseInterval = SPEED_INTERVALS[speed];
    if (gameMode === 'chaos' && chaosMode.speedMultiplier > 1) {
      return Math.max(baseInterval / chaosMode.speedMultiplier, 50); // Min 50ms
    }
    return baseInterval;
  }, [speed, gameMode, chaosMode.speedMultiplier]);

  // Game loop with performance optimizations
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      const currentSnake = gameState.snake;
      const currentFood = gameState.food;
      const direction = directionRef.current;

      // Calculate new head position
      let newHead = getNewHeadPosition(currentSnake[0], direction);

      // Handle wall collision based on game mode
      if (gameMode === 'classic') {
        // Classic mode: wall collision ends game
        if (checkWallCollision(newHead)) {
          playGameOverSound();
          endGame();
          return;
        }
      } else {
        // Modern and Chaos modes: walls wrap around
        newHead = wrapAroundWalls(newHead);
      }

      // Check obstacle collision in chaos mode (phase 2 and 3)
      if (gameMode === 'chaos' && chaosMode.phase >= 2) {
        if (checkObstacleCollision(newHead, chaosMode.obstacles)) {
          playGameOverSound();
          endGame();
          return;
        }
      }

      // Check if food is eaten
      const foodEaten = newHead.x === currentFood.x && newHead.y === currentFood.y;

      if (foodEaten) {
        playEatSound();
        const newSnake = [newHead, ...currentSnake];
        
        if (checkSelfCollision(newHead, currentSnake)) {
          playGameOverSound();
          endGame();
          return;
        }
        
        increaseScore();
        const newFood = generateFood(newSnake);
        
        updateGameState({
          snake: newSnake,
          food: newFood,
          direction,
        });
      } else {
        const snakeBodyWithoutTail = currentSnake.slice(0, -1);
        if (checkSelfCollision(newHead, snakeBodyWithoutTail)) {
          playGameOverSound();
          endGame();
          return;
        }

        const newSnake = [newHead, ...snakeBodyWithoutTail];
        
        updateGameState({
          snake: newSnake,
          food: currentFood,
          direction,
        });
      }
    };

    const intervalId = setInterval(gameLoop, speedInterval);
    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver, speedInterval, gameMode, gameState.snake, gameState.food, chaosMode.phase, chaosMode.obstacles, updateGameState, endGame, increaseScore, playEatSound, playGameOverSound]);

  // Add score to leaderboard when game ends
  useEffect(() => {
    if (gameOver && score > 0 && !scoreAddedRef.current) {
      addScore(score, gameMode, speed);
      scoreAddedRef.current = true;
    }
  }, [gameOver, score, gameMode, speed, addScore]);

  // Enhanced reset game
  const resetGame = useCallback(() => {
    resetGameState();
    resetScore();
    scoreAddedRef.current = false;
    if (gameMode === 'chaos') {
      chaosMode.reset();
    }
  }, [resetGameState, resetScore, gameMode, chaosMode]);

  // Prepare chaos state for UI
  const chaosState: ChaosState | undefined = gameMode === 'chaos' ? {
    phase: chaosMode.phase,
    elapsedTime: chaosMode.elapsedTime,
    obstacles: chaosMode.obstacles,
    speedMultiplier: chaosMode.speedMultiplier,
    phaseLabel: chaosMode.phaseLabel,
  } : undefined;

  return {
    gameState,
    score,
    highScore,
    gameOver,
    isPlaying,
    direction: directionRef.current,
    moveSnake,
    resetGame,
    togglePause,
    chaosState,
  };
};
