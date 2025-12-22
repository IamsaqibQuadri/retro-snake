
import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { GameSpeed, GameMode } from '../types/gameTypes';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { useGameSounds } from './useGameSounds';
import { useLeaderboard } from './useLeaderboard';
import { useGameTimer } from './useGameTimer';
import { useChaosMode } from './useChaosMode';
import { generateFood, checkWallCollision, checkSelfCollision, getNewHeadPosition, wrapAroundWalls } from '../utils/gameUtils';
import { generateObstacles, checkObstacleCollision } from '../utils/obstacleUtils';
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

  // Time Attack mode timer
  const { timeRemaining, isTimeUp, resetTimer } = useGameTimer(60, isPlaying && gameMode === 'timeattack', gameOver);

  // Survival mode speed tracking
  const [currentSpeed, setCurrentSpeed] = useState<number>(SPEED_INTERVALS[speed]);
  const [foodCount, setFoodCount] = useState(0);

  // Initialize obstacles for obstacles mode
  const obstaclesRef = useRef(gameMode === 'obstacles' ? generateObstacles(gameState.snake, gameState.food) : []);

  // Chaos mode integration
  const chaosMode = useChaosMode(
    isPlaying && gameMode === 'chaos',
    gameOver,
    speed,
    gameState.snake,
    gameState.food
  );

  // Memoize speed interval
  const speedInterval = useMemo(() => {
    if (gameMode === 'chaos') {
      return chaosMode.currentSpeedInterval;
    }
    if (gameMode === 'survival') {
      return currentSpeed;
    }
    return SPEED_INTERVALS[speed];
  }, [speed, gameMode, currentSpeed, chaosMode.currentSpeedInterval]);

  // Handle time up in Time Attack mode
  useEffect(() => {
    if (gameMode === 'timeattack' && isTimeUp && !gameOver) {
      playGameOverSound();
      endGame();
    }
  }, [isTimeUp, gameMode, gameOver, playGameOverSound, endGame]);

  // Update obstacles in game state for obstacles mode
  useEffect(() => {
    if (gameMode === 'obstacles' && !gameState.obstacles) {
      updateGameState({ obstacles: obstaclesRef.current });
    }
  }, [gameMode, gameState.obstacles, updateGameState]);

  // Update obstacles in game state for chaos mode (phase 2+)
  useEffect(() => {
    if (gameMode === 'chaos' && chaosMode.phase >= 2 && chaosMode.obstacles.length > 0) {
      updateGameState({ obstacles: chaosMode.obstacles });
    }
  }, [gameMode, chaosMode.phase, chaosMode.obstacles, updateGameState]);

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
      if (gameMode === 'chaos') {
        // Chaos mode: walls always wrap around
        newHead = wrapAroundWalls(newHead);
      } else if (gameMode === 'classic' || gameMode === 'obstacles' || gameMode === 'timeattack' || gameMode === 'survival') {
        if (checkWallCollision(newHead)) {
          playGameOverSound();
          endGame();
          return;
        }
      } else {
        newHead = wrapAroundWalls(newHead);
      }

      // Check obstacle collision for obstacles mode
      if (gameMode === 'obstacles' && checkObstacleCollision(newHead, obstaclesRef.current)) {
        playGameOverSound();
        endGame();
        return;
      }

      // Check obstacle collision for chaos mode (phase 2+)
      if (gameMode === 'chaos' && chaosMode.obstaclesDeadly && checkObstacleCollision(newHead, chaosMode.obstacles)) {
        playGameOverSound();
        endGame();
        return;
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
        
        // Survival mode: increase speed every 3 food
        if (gameMode === 'survival') {
          const newFoodCount = foodCount + 1;
          setFoodCount(newFoodCount);
          if (newFoodCount % 3 === 0) {
            setCurrentSpeed(prev => Math.max(prev - 20, 80)); // Cap at 80ms
          }
        }
        
        const newFood = generateFood(newSnake);
        
        // Determine obstacles based on mode
        let obstacles: typeof gameState.obstacles;
        if (gameMode === 'obstacles') {
          obstacles = obstaclesRef.current;
        } else if (gameMode === 'chaos' && chaosMode.phase >= 2) {
          obstacles = chaosMode.obstacles;
        }
        
        updateGameState({
          snake: newSnake,
          food: newFood,
          direction,
          obstacles,
        });
      } else {
        const snakeBodyWithoutTail = currentSnake.slice(0, -1);
        if (checkSelfCollision(newHead, snakeBodyWithoutTail)) {
          playGameOverSound();
          endGame();
          return;
        }

        const newSnake = [newHead, ...snakeBodyWithoutTail];
        
        // Determine obstacles based on mode
        let obstacles: typeof gameState.obstacles;
        if (gameMode === 'obstacles') {
          obstacles = obstaclesRef.current;
        } else if (gameMode === 'chaos' && chaosMode.phase >= 2) {
          obstacles = chaosMode.obstacles;
        }
        
        updateGameState({
          snake: newSnake,
          food: currentFood,
          direction,
          obstacles,
        });
      }
    };

    const intervalId = setInterval(gameLoop, speedInterval);
    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver, speedInterval, gameMode, gameState.snake, gameState.food, updateGameState, endGame, increaseScore, playEatSound, playGameOverSound, foodCount, chaosMode.obstacles, chaosMode.obstaclesDeadly, chaosMode.phase]);

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
    resetTimer();
    setCurrentSpeed(SPEED_INTERVALS[speed]);
    setFoodCount(0);
    scoreAddedRef.current = false;
    
    // Regenerate obstacles for obstacles mode
    if (gameMode === 'obstacles') {
      obstaclesRef.current = generateObstacles([{ x: 7, y: 7 }], { x: 5, y: 5 });
    }
    
    // Reset chaos mode
    if (gameMode === 'chaos') {
      chaosMode.resetChaosMode();
    }
  }, [resetGameState, resetScore, resetTimer, speed, gameMode, chaosMode.resetChaosMode]);

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
    timeRemaining: gameMode === 'timeattack' ? timeRemaining : undefined,
    speedLevel: gameMode === 'survival' ? `${Math.floor((SPEED_INTERVALS[speed] - currentSpeed) / 20) + 1}x` : undefined,
    // Chaos mode specific returns
    chaosPhase: gameMode === 'chaos' ? chaosMode.phaseLabel : undefined,
    chaosElapsedTime: gameMode === 'chaos' ? chaosMode.formattedTime : undefined,
    chaosPhaseNumber: gameMode === 'chaos' ? chaosMode.phase : undefined,
  };
};
