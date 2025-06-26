
import { useEffect, useCallback, useRef } from 'react';
import { GameSpeed } from '../types/gameTypes';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { useGameSounds } from './useGameSounds';
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

  // Game loop with proper state handling, game mode support, and sound effects
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      const currentSnake = gameState.snake;
      const currentFood = gameState.food;
      const direction = directionRef.current;

      console.log('Game loop - Current food position:', currentFood);
      console.log('Game loop - Current snake length:', currentSnake.length);
      console.log('Game mode:', gameMode);

      // Calculate new head position
      let newHead = getNewHeadPosition(currentSnake[0], direction);
      console.log('New head position before wall check:', newHead, 'Direction:', direction);

      // Handle wall collision based on game mode
      if (gameMode === 'classic') {
        // Classic mode: end game on wall collision
        if (checkWallCollision(newHead)) {
          console.log('Game over due to wall collision (Classic mode)');
          playGameOverSound();
          endGame();
          return;
        }
      } else {
        // Modern mode: wrap around walls
        newHead = wrapAroundWalls(newHead);
        console.log('Wrapped head position:', newHead);
      }

      // Check if food is eaten BEFORE checking self collision
      const foodEaten = newHead.x === currentFood.x && newHead.y === currentFood.y;
      console.log('Food eaten?', foodEaten, 'Head:', newHead, 'Food:', currentFood);

      if (foodEaten) {
        console.log('Food eaten! Score increasing...');
        
        // Play eat sound
        playEatSound();
        
        // Create new snake with grown length (no tail removal)
        const newSnake = [newHead, ...currentSnake];
        
        // Check self collision with new snake (shouldn't happen when eating food)
        if (checkSelfCollision(newHead, currentSnake)) {
          console.log('Game over due to self collision while eating food');
          playGameOverSound();
          endGame();
          return;
        }
        
        increaseScore();

        // Generate new food with the grown snake
        const newFood = generateFood(newSnake);
        console.log('Generated new food at:', newFood);
        console.log('Updating state with grown snake and new food');

        // Update state with both new snake and new food
        updateGameState({
          snake: newSnake,
          food: newFood,
          direction,
        });
      } else {
        // No food eaten - check self collision against body (excluding tail)
        const snakeBodyWithoutTail = currentSnake.slice(0, -1);
        if (checkSelfCollision(newHead, snakeBodyWithoutTail)) {
          console.log('Game over due to self collision');
          playGameOverSound();
          endGame();
          return;
        }

        // Move snake normally (remove tail)
        const newSnake = [newHead, ...snakeBodyWithoutTail];
        console.log('No food eaten, normal movement');
        
        updateGameState({
          snake: newSnake,
          food: currentFood, // Keep same food position
          direction,
        });
      }
    };

    const intervalId = setInterval(gameLoop, SPEED_INTERVALS[speed]);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, gameOver, speed, gameMode, gameState.snake, gameState.food, updateGameState, endGame, increaseScore, playEatSound, playGameOverSound]);

  // Reset game with score reset
  const resetGame = useCallback(() => {
    resetGameState();
    resetScore();
  }, [resetGameState, resetScore]);

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
