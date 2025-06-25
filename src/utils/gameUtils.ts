
import { Position, Direction } from '../types/gameTypes';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/gameConstants';

export const generateFood = (snake: Position[]): Position => {
  console.log('Generating food, snake length:', snake.length);
  console.log('Current snake positions:', snake);
  
  // Create array of all possible positions
  const allPositions: Position[] = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      allPositions.push({ x, y });
    }
  }
  
  // Filter out positions occupied by snake
  const availablePositions = allPositions.filter(pos => 
    !snake.some(segment => segment.x === pos.x && segment.y === pos.y)
  );
  
  console.log('Available positions for food:', availablePositions.length);
  
  // If no positions available (shouldn't happen in normal game), return a position
  if (availablePositions.length === 0) {
    console.log('No available positions! Game should end.');
    return { x: 0, y: 0 };
  }
  
  // Select random position from available ones
  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  const newFood = availablePositions[randomIndex];
  
  console.log('New food position generated:', newFood);
  return newFood;
};

export const checkWallCollision = (head: Position): boolean => {
  return head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT;
};

export const checkSelfCollision = (head: Position, snakeBody: Position[]): boolean => {
  // Only check against the body (excluding the tail that will be removed)
  return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
};

export const getNewHeadPosition = (currentHead: Position, direction: Direction): Position => {
  const head = { ...currentHead };
  switch (direction) {
    case 'UP':
      head.y -= 1;
      break;
    case 'DOWN':
      head.y += 1;
      break;
    case 'LEFT':
      head.x -= 1;
      break;
    case 'RIGHT':
      head.x += 1;
      break;
  }
  return head;
};

export const getOppositeDirection = (direction: Direction): Direction => {
  const opposites = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  } as const;
  return opposites[direction];
};
