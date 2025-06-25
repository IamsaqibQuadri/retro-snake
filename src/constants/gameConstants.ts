
export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 15;

export const SPEED_INTERVALS = {
  slow: 300,
  normal: 180,
  fast: 120,
} as const;

export const INITIAL_SNAKE_POSITION = { x: 7, y: 7 };
export const INITIAL_FOOD_POSITION = { x: 5, y: 5 };
export const INITIAL_DIRECTION = 'RIGHT' as const;

export const SCORE_PER_FOOD = 10;
export const HIGH_SCORE_KEY = 'snake-high-score';
