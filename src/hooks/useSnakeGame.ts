
import { useEffect, useCallback, useRef, useMemo } from 'react';
import { GameSpeed } from '../types/gameTypes';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { useGameSounds } from './useGameSounds';
import { useLeaderboard } from './useLeaderboard';
import { generateFood, checkWallCollision, checkSelfCollision, getNewHeadPosition, wrapAroundWalls } from '../utils/gameUtils';
import { SPEED_INTERVALS } from '../constants/gameConstants';

export const useSnakeGame = (speed: GameSpeed, gameMode: 'classic' | 'modern' = 'classic') => {
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

  // Memoize speed interval to prevent unnecessary re-renders
  const speedInterval = useMemo(() => SPEED_INTERVALS[speed], [speed]);

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
        if (checkWallCollision(newHead)) {
          playGameOverSound();
          endGame();
          return;
        }
      } else {
        newHead = wrapAroundWalls(newHead);
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
  }, [isPlaying, gameOver, speedInterval, gameMode, gameState.snake, gameState.food, updateGameState, endGame, increaseScore, playEatSound, playGameOverSound]);

  // Enhanced reset game with leaderboard entry
  const resetGame = useCallback(() => {
    if (score > 0) {
      addScore(score, gameMode, speed);
    }
    resetGameState();
    resetScore();
  }, [resetGameState, resetScore, score, gameMode, speed, addScore]);

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
  };
};
