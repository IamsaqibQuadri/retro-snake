
import { useState, useRef } from 'react';
import { GameState, Direction } from '../types/gameTypes';
import { generateFood, getOppositeDirection } from '../utils/gameUtils';
import { INITIAL_SNAKE_POSITION, INITIAL_FOOD_POSITION, INITIAL_DIRECTION } from '../constants/gameConstants';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [INITIAL_SNAKE_POSITION],
    food: INITIAL_FOOD_POSITION,
    direction: INITIAL_DIRECTION,
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  };

  const moveSnake = (newDirection: Direction) => {
    if (gameOver) return;

    // Prevent reverse direction
    if (getOppositeDirection(newDirection) !== directionRef.current) {
      directionRef.current = newDirection;
      setGameState(prev => ({ ...prev, direction: newDirection }));
    }
  };

  const resetGame = () => {
    const initialSnake = [INITIAL_SNAKE_POSITION];
    const initialFood = generateFood(initialSnake);
    
    setGameState({
      snake: initialSnake,
      food: initialFood,
      direction: INITIAL_DIRECTION,
    });
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setIsPlaying(true);
  };

  const togglePause = () => {
    if (!gameOver) {
      setIsPlaying(prev => !prev);
    }
  };

  const endGame = () => {
    setGameOver(true);
    setIsPlaying(false);
  };

  return {
    gameState,
    gameOver,
    isPlaying,
    directionRef,
    updateGameState,
    moveSnake,
    resetGame,
    togglePause,
    endGame,
  };
};
