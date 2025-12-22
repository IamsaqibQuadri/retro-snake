import { useState, useEffect, useCallback, useRef } from 'react';
import { Position } from '../types/gameTypes';
import { generateObstacles } from '../utils/obstacleUtils';
import { SPEED_INTERVALS } from '../constants/gameConstants';
import { GameSpeed } from '../types/gameTypes';

export type ChaosPhase = 1 | 2 | 3;

interface ChaosState {
  phase: ChaosPhase;
  elapsedTime: number;
  obstacles: Position[];
  currentSpeedInterval: number;
  phaseLabel: string;
  speedMultiplier: string;
}

// Phase timing constants (in seconds)
const PHASE_1_END = 60;      // 0-60s: Modern mode
const PHASE_2_END = 180;     // 60-180s: Obstacles appear
// Phase 3: 180s+: Speed ramps up

export const useChaosMode = (
  isPlaying: boolean,
  gameOver: boolean,
  speed: GameSpeed,
  snake: Position[],
  food: Position
) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [phase, setPhase] = useState<ChaosPhase>(1);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const obstaclesGeneratedRef = useRef(false);
  const baseSpeed = SPEED_INTERVALS[speed];

  // Calculate current phase based on elapsed time
  useEffect(() => {
    if (elapsedTime < PHASE_1_END) {
      setPhase(1);
    } else if (elapsedTime < PHASE_2_END) {
      setPhase(2);
      // Generate obstacles when entering phase 2
      if (!obstaclesGeneratedRef.current) {
        const newObstacles = generateObstacles(snake, food);
        setObstacles(newObstacles);
        obstaclesGeneratedRef.current = true;
      }
    } else {
      setPhase(3);
      // Calculate speed multiplier for phase 3 (increases every 60 seconds after phase 2)
      const timeInPhase3 = elapsedTime - PHASE_2_END;
      const multiplier = Math.floor(timeInPhase3 / 60) + 2; // Starts at 2x, increases every minute
      setSpeedMultiplier(Math.min(multiplier, 10)); // Cap at 10x
    }
  }, [elapsedTime, snake, food]);

  // Timer for elapsed time
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  // Calculate current speed interval based on phase
  const currentSpeedInterval = phase === 3 
    ? Math.max(baseSpeed / speedMultiplier, 50) // Cap minimum at 50ms
    : baseSpeed;

  // Get phase label for UI
  const getPhaseLabel = (): string => {
    switch (phase) {
      case 1: return '🌐 PHASE 1';
      case 2: return '🧱 PHASE 2';
      case 3: return `🔥 PHASE 3 (${speedMultiplier}x)`;
      default: return '';
    }
  };

  // Reset chaos mode state
  const resetChaosMode = useCallback(() => {
    setElapsedTime(0);
    setObstacles([]);
    setPhase(1);
    setSpeedMultiplier(1);
    obstaclesGeneratedRef.current = false;
  }, []);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    phase,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    obstacles,
    currentSpeedInterval,
    phaseLabel: getPhaseLabel(),
    speedMultiplier: `${speedMultiplier}x`,
    resetChaosMode,
    // Game rules per phase
    wallsWrapAround: true, // Always wrap around in chaos mode
    obstaclesDeadly: phase >= 2, // Obstacles are deadly in phase 2 and 3
  };
};
