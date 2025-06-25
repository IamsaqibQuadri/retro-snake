
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
      updateGameState(prevState => {
        const { snake, food } = prevState;
        const direction = directionRef.current;

        console.log('Game loop - Current food position:', food);
        console.log('Game loop - Current snake:', snake);

        // Calculate new head position
        const newHead = getNewHeadPosition(snake[0], direction);
        console.log('New head position:', newHead, 'Direction:', direction);

        // Check wall collision
        if (checkWallCollision(newHead)) {
          console.log('Game over due to wall collision');
          endGame();
          return prevState;
        }

        // Check if food is eaten BEFORE checking self collision
        const foodEaten = newHead.x === food.x && newHead.y === food.y;
        console.log('Food eaten?', foodEaten, 'Head:', newHead, 'Food:', food);

        if (foodEaten) {
          console.log('Food eaten! Score increasing...');
          
          // Create new snake with grown length (no tail removal)
          const newSnake = [newHead, ...snake];
          
          // Check self collision with new snake (shouldn't happen when eating food)
          if (checkSelfCollision(newHead, snake)) {
            console.log('Game over due to self collision while eating food');
            endGame();
            return prevState;
          }
          
          increaseScore();

          // Generate new food with the grown snake
          const newFood = generateFood(newSnake);
          console.log('Generated new food at:', newFood);
          console.log('Returning new state with grown snake and new food');

          return {
            snake: newSnake,
            food: newFood,
            direction,
          };
        } else {
          // No food eaten - check self collision against body (excluding tail)
          const snakeBodyWithoutTail = snake.slice(0, -1);
          if (checkSelfCollision(newHead, snakeBodyWithoutTail)) {
            console.log('Game over due to self collision');
            endGame();
            return prevState;
          }

          // Move snake normally (remove tail)
          const newSnake = [newHead, ...snakeBodyWithoutTail];
          console.log('No food eaten, normal movement');
          
          return {
            snake: newSnake,
            food: food, // Keep same food position
            direction,
          };
        }
      });
    };

    const intervalId = setInterval(gameLoop, SPEED_INTERVALS[speed]);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, gameOver, speed, updateGameState, endGame, increaseScore]);

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
