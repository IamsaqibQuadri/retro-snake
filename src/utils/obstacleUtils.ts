import { Position } from '../types/gameTypes';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/gameConstants';

export const generateObstacles = (snake: Position[], food: Position, count: number = 8): Position[] => {
  const obstacles: Position[] = [];
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let obstacle: Position;

    do {
      obstacle = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
      attempts++;
    } while (
      attempts < maxAttempts &&
      (isPositionOccupied(obstacle, snake) ||
        isPositionOccupied(obstacle, [food]) ||
        isPositionOccupied(obstacle, obstacles) ||
        isTooCloseToSnake(obstacle, snake))
    );

    if (attempts < maxAttempts) {
      obstacles.push(obstacle);
    }
  }

  return obstacles;
};

export const isPositionOccupied = (position: Position, positions: Position[]): boolean => {
  return positions.some(p => p.x === position.x && p.y === position.y);
};

export const checkObstacleCollision = (head: Position, obstacles: Position[]): boolean => {
  return obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y);
};

const isTooCloseToSnake = (position: Position, snake: Position[]): boolean => {
  const head = snake[0];
  const distance = Math.abs(position.x - head.x) + Math.abs(position.y - head.y);
  return distance < 3; // Keep at least 3 cells away from snake head
};
