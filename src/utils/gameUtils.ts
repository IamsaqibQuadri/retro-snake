
import { Position, Direction } from '../types/gameTypes';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/gameConstants';

export const generateFood = (snake: Position[]): Position => {
  const allPositions: Position[] = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      allPositions.push({ x, y });
    }
  }
  
  const availablePositions = allPositions.filter(pos => 
    !snake.some(segment => segment.x === pos.x && segment.y === pos.y)
  );
  
  if (availablePositions.length === 0) {
    return { x: 0, y: 0 };
  }
  
  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  return availablePositions[randomIndex];
};

export const checkWallCollision = (head: Position): boolean => {
  return head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT;
};

export const wrapAroundWalls = (head: Position): Position => {
  const wrappedHead = { ...head };
  
  // Wrap horizontally
  if (wrappedHead.x < 0) {
    wrappedHead.x = GRID_WIDTH - 1;
  } else if (wrappedHead.x >= GRID_WIDTH) {
    wrappedHead.x = 0;
  }
  
  // Wrap vertically
  if (wrappedHead.y < 0) {
    wrappedHead.y = GRID_HEIGHT - 1;
  } else if (wrappedHead.y >= GRID_HEIGHT) {
    wrappedHead.y = 0;
  }
  
  return wrappedHead;
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
