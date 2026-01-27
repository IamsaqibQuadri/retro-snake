
export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameSpeed = 'slow' | 'normal' | 'fast';
export type GameMode = 'classic' | 'modern' | 'chaos';
export type ChaosPhase = 1 | 2 | 3;

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

export interface ChaosState {
  phase: ChaosPhase;
  elapsedTime: number;
  obstacles: Position[];
  speedMultiplier: number;
  phaseLabel: string;
}
