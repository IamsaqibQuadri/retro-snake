
import { useEffect, useCallback } from 'react';
import { GameSpeed } from '../types/gameTypes';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { generateFood, checkWallCollision, checkSelfCollision, getNewHeadPosition } from '../utils/gameUtils';
import { SPEED_INTERVALS } from '../constants/gameConstants';

export const useSnakeGame = (speed: GameSpeed) => {
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

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      // Get fresh state values
      const currentSnake = gameState.snake;
      const currentFood = gameState.food;
      const direction = directionRef.current;

      console.log('Game loop - Current food position:', currentFood);
      console.log('Game loop - Current snake:', currentSnake);

      // Calculate new head position
      const newHead = getNewHeadPosition(currentSnake[0], direction);
      console.log('New head position:', newHead, 'Direction:', direction);

      // Check wall collision
      if (checkWallCollision(newHead)) {
        console.log('Game over due to wall collision');
        endGame();
        return;
      }

      // Check if food is eaten BEFORE checking self collision
      const foodEaten = newHead.x === currentFood.x && newHead.y === currentFood.y;
      console.log('Food eaten?', foodEaten, 'Head:', newHead, 'Food:', currentFood);

      if (foodEaten) {
        console.log('Food eaten! Score increasing...');
        
        // Create new snake with grown length (no tail removal)
        const newSnake = [newHead, ...currentSnake];
        
        // Check self collision with new snake (shouldn't happen when eating food)
        if (checkSelfCollision(newHead, currentSnake)) {
          console.log('Game over due to self collision while eating food');
          endGame();
          return;
        }
        
        increaseScore();

        // Generate new food with the grown snake
        const newFood = generateFood(newSnake);
        console.log('Generated new food at:', newFood);
        console.log('Updating state with grown snake and new food');

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
  }, [isPlaying, gameOver, speed, gameState.snake, gameState.food, directionRef, updateGameState, endGame, increaseScore]);

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
