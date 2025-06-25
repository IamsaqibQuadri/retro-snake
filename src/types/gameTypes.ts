
export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameSpeed = 'slow' | 'normal' | 'fast';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
}

export interface GameStats {
  score: number;
  highScore: number;
  gameOver: boolean;
  isPlaying: boolean;
}
