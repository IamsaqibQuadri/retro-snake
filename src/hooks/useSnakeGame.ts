
import { useEffect, useCallback, useRef, useMemo } from 'react';
import { GameSpeed, GameMode, Position, ChaosState, TimeAttackState, SurvivalState } from '../types/gameTypes';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { useGameSounds } from './useGameSounds';
import { useLeaderboard } from './useLeaderboard';
import { useChaosMode } from './useChaosMode';
import { useTimeAttack } from './useTimeAttack';
import { useSurvivalMode } from './useSurvivalMode';
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

  // Time Attack mode hook
  const timeAttack = useTimeAttack(
    isPlaying && gameMode === 'timeattack',
    gameOver
  );

  // Survival mode hook
  const survivalMode = useSurvivalMode();

  // Handle time attack game end
  useEffect(() => {
    if (gameMode === 'timeattack' && timeAttack.isTimeUp && isPlaying) {
      playGameOverSound();
      endGame();
    }
  }, [gameMode, timeAttack.isTimeUp, isPlaying, playGameOverSound, endGame]);

  // Memoize speed interval with mode-specific speed multipliers
  const speedInterval = useMemo(() => {
    const baseInterval = SPEED_INTERVALS[speed];
    
    if (gameMode === 'chaos' && chaosMode.speedMultiplier > 1) {
      return Math.max(baseInterval / chaosMode.speedMultiplier, 50); // Min 50ms
    }
    
    if (gameMode === 'survival' && survivalMode.speedMultiplier > 1) {
      return Math.max(baseInterval / survivalMode.speedMultiplier, 50); // Min 50ms
    }
    
    return baseInterval;
  }, [speed, gameMode, chaosMode.speedMultiplier, survivalMode.speedMultiplier]);

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
        // Modern, Chaos, TimeAttack, Survival modes: walls wrap around
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
        
        // Track food eaten for survival mode
        if (gameMode === 'survival') {
          survivalMode.onFoodEaten();
        }
        
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
  }, [isPlaying, gameOver, speedInterval, gameMode, gameState.snake, gameState.food, chaosMode.phase, chaosMode.obstacles, updateGameState, endGame, increaseScore, playEatSound, playGameOverSound, survivalMode]);

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
    if (gameMode === 'timeattack') {
      timeAttack.reset();
    }
    if (gameMode === 'survival') {
      survivalMode.reset();
    }
  }, [resetGameState, resetScore, gameMode, chaosMode, timeAttack, survivalMode]);

  // Prepare mode-specific state for UI
  const chaosState: ChaosState | undefined = gameMode === 'chaos' ? {
    phase: chaosMode.phase,
    elapsedTime: chaosMode.elapsedTime,
    obstacles: chaosMode.obstacles,
    speedMultiplier: chaosMode.speedMultiplier,
    phaseLabel: chaosMode.phaseLabel,
  } : undefined;

  const timeAttackState: TimeAttackState | undefined = gameMode === 'timeattack' ? {
    timeRemaining: timeAttack.timeRemaining,
    isActive: timeAttack.isActive,
  } : undefined;

  const survivalState: SurvivalState | undefined = gameMode === 'survival' ? {
    speedMultiplier: survivalMode.speedMultiplier,
    foodsEaten: survivalMode.foodsEaten,
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
    timeAttackState,
    survivalState,
  };
};
