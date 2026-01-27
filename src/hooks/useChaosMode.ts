import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, ChaosPhase, ChaosState } from '../types/gameTypes';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/gameConstants';

// Phase timing constants
const PHASE_1_END = 40;  // Phase 1: 0-40 seconds
const PHASE_2_END = 120; // Phase 2: 40-120 seconds
// Phase 3: 120+ seconds

export const useChaosMode = (
  isPlaying: boolean,
  gameOver: boolean,
  getSnake: () => Position[],
  getFood: () => Position
): ChaosState & { reset: () => void } => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [phase, setPhase] = useState<ChaosPhase>(1);
  const [obstacles, setObstacles] = useState<Position[]>([]);
  
  // Track if obstacles have been generated for phase 2
  const obstaclesGeneratedRef = useRef(false);
  const previousPhaseRef = useRef<ChaosPhase>(1);

  // Generate obstacles avoiding snake and food
  const generateObstacles = useCallback(() => {
    const snake = getSnake();
    const food = getFood();
    const obstacleCount = Math.floor(Math.random() * 4) + 5; // 5-8 obstacles
    const newObstacles: Position[] = [];
    
    // Create set of occupied positions
    const occupied = new Set<string>();
    snake.forEach(pos => occupied.add(`${pos.x},${pos.y}`));
    occupied.add(`${food.x},${food.y}`);
    
    // Add buffer zone around snake head (2 cells in each direction)
    const head = snake[0];
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        occupied.add(`${head.x + dx},${head.y + dy}`);
      }
    }
    
    let attempts = 0;
    while (newObstacles.length < obstacleCount && attempts < 100) {
      const x = Math.floor(Math.random() * GRID_WIDTH);
      const y = Math.floor(Math.random() * GRID_HEIGHT);
      const key = `${x},${y}`;
      
      if (!occupied.has(key)) {
        newObstacles.push({ x, y });
        occupied.add(key);
      }
      attempts++;
    }
    
    return newObstacles;
  }, [getSnake, getFood]);

  // Timer effect - runs every second when playing
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  // Phase calculation effect - only depends on elapsedTime
  useEffect(() => {
    let newPhase: ChaosPhase;
    
    if (elapsedTime < PHASE_1_END) {
      newPhase = 1;
    } else if (elapsedTime < PHASE_2_END) {
      newPhase = 2;
    } else {
      newPhase = 3;
    }
    
    if (newPhase !== phase) {
      setPhase(newPhase);
    }
  }, [elapsedTime, phase]);

  // Obstacle generation - only when entering phase 2
  useEffect(() => {
    if (phase === 2 && previousPhaseRef.current === 1 && !obstaclesGeneratedRef.current) {
      const newObstacles = generateObstacles();
      setObstacles(newObstacles);
      obstaclesGeneratedRef.current = true;
    }
    previousPhaseRef.current = phase;
  }, [phase, generateObstacles]);

  // Calculate speed multiplier for phase 3
  const getSpeedMultiplier = useCallback(() => {
    if (phase !== 3) return 1;
    // Speed increases every 60 seconds in phase 3
    const timeInPhase3 = elapsedTime - PHASE_2_END;
    return Math.min(Math.floor(timeInPhase3 / 60) + 2, 5); // Cap at 5x
  }, [phase, elapsedTime]);

  // Get phase label
  const getPhaseLabel = useCallback(() => {
    switch (phase) {
      case 1:
        return 'Phase 1 🌐';
      case 2:
        return 'Phase 2 🧱';
      case 3:
        const multiplier = getSpeedMultiplier();
        return `Phase 3 🔥 ${multiplier}x`;
    }
  }, [phase, getSpeedMultiplier]);

  // Reset function for new game
  const reset = useCallback(() => {
    setElapsedTime(0);
    setPhase(1);
    setObstacles([]);
    obstaclesGeneratedRef.current = false;
    previousPhaseRef.current = 1;
  }, []);

  return {
    phase,
    elapsedTime,
    obstacles,
    speedMultiplier: getSpeedMultiplier(),
    phaseLabel: getPhaseLabel(),
    reset,
  };
};
