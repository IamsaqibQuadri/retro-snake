
export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameSpeed = 'slow' | 'normal' | 'fast';
export type GameMode = 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  obstacles?: Position[];
  currentSpeed?: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  gameOver: boolean;
  isPlaying: boolean;
}
