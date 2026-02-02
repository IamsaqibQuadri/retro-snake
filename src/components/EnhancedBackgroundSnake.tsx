
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

interface MatrixChar {
  id: number;
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
}

const EnhancedBackgroundSnake = () => {
  const { theme } = useTheme();
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [food, setFood] = useState<Food>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [matrixChars, setMatrixChars] = useState<MatrixChar[]>([]);

  // Grid dimensions for better coverage
  const GRID_WIDTH = 50;
  const GRID_HEIGHT = 40;

  // Matrix characters - katakana, numbers, symbols
  const MATRIX_CHARS = 'ァアィイゥウェエォオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

  // Initialize matrix rain
  useEffect(() => {
    if (theme === 'matrix') {
      const columns = Math.floor(window.innerWidth / 20);
      const initialChars: MatrixChar[] = [];
      
      for (let i = 0; i < columns * 2; i++) {
        initialChars.push({
          id: i,
          x: Math.floor(Math.random() * columns) * 20,
          y: Math.random() * window.innerHeight - window.innerHeight,
          char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          speed: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.7,
        });
      }
      setMatrixChars(initialChars);
    }
  }, [theme]);

  // Matrix rain animation
  useEffect(() => {
    if (theme !== 'matrix') return;

    const interval = setInterval(() => {
      setMatrixChars(prev => prev.map(char => {
        let newY = char.y + char.speed;
        if (newY > window.innerHeight) {
          return {
            ...char,
            y: -20,
            x: Math.floor(Math.random() * Math.floor(window.innerWidth / 20)) * 20,
            char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
            speed: 2 + Math.random() * 4,
            opacity: 0.3 + Math.random() * 0.7,
          };
        }
        return { ...char, y: newY };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [theme]);

  // Generate new food position
  const generateFood = useCallback((currentSnake: SnakeSegment[]) => {
    let newFood: Food;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [GRID_WIDTH, GRID_HEIGHT]);

  // Snake movement logic with food eating
  useEffect(() => {
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Move head based on direction
        switch (direction) {
          case 'up':
            head.y -= 1;
            break;
          case 'down':
            head.y += 1;
            break;
          case 'left':
            head.x -= 1;
            break;
          case 'right':
            head.x += 1;
            break;
        }

        // Wrap around screen
        if (head.x < 0) head.x = GRID_WIDTH - 1;
        if (head.x >= GRID_WIDTH) head.x = 0;
        if (head.y < 0) head.y = GRID_HEIGHT - 1;
        if (head.y >= GRID_HEIGHT) head.y = 0;

        // Check if food is eaten
        const foodEaten = head.x === food.x && head.y === food.y;

        if (foodEaten) {
          // Grow snake and generate new food
          const grownSnake = [head, ...newSnake];
          setFood(generateFood(grownSnake));
          setScore(prev => prev + 1);
          return grownSnake;
        } else {
          // Move snake normally
          newSnake.unshift(head);
          newSnake.pop();
          return newSnake;
        }
      });
    }, 200); // Slightly slower for better visibility

    return () => clearInterval(interval);
  }, [direction, food, generateFood, GRID_WIDTH, GRID_HEIGHT]);

  // Direction change logic
  useEffect(() => {
    const directionInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
        const currentDirection = direction;
        const oppositeDirection = currentDirection === 'up' ? 'down' : 
                                currentDirection === 'down' ? 'up' :
                                currentDirection === 'left' ? 'right' : 'left';
        
        const availableDirections = directions.filter(dir => dir !== oppositeDirection);
        const randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        setDirection(randomDirection);
      }
    }, 2000);

    return () => clearInterval(directionInterval);
  }, [direction]);

  // Get theme-specific snake colors
  const getSnakeColors = () => {
    switch (theme) {
      case 'matrix':
        return { head: '#00ff00', body: '#00cc00', glow: '#00ff00' };
      case 'ocean':
        return { head: '#00d4ff', body: '#0099cc', glow: '#00d4ff' };
      case 'pastel':
        return { head: '#a855f7', body: '#7c3aed', glow: '#a855f7' };
      case 'dark':
        return { head: '#22c55e', body: '#16a34a', glow: '#22c55e' };
      default:
        return { head: '#22c55e', body: '#16a34a', glow: '#22c55e' };
    }
  };

  const colors = getSnakeColors();

  return (
    <div className="fixed inset-0 opacity-50 pointer-events-none overflow-hidden z-0">
      {/* Matrix falling code effect */}
      {theme === 'matrix' && (
        <div className="absolute inset-0">
          {matrixChars.map(char => (
            <div
              key={char.id}
              className="absolute font-mono text-sm"
              style={{
                left: char.x,
                top: char.y,
                color: `hsl(120, 100%, ${50 + char.opacity * 30}%)`,
                opacity: char.opacity,
                textShadow: `0 0 10px #00ff00, 0 0 20px #00ff00`,
              }}
            >
              {char.char}
            </div>
          ))}
          {/* Scanline overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            }}
          />
        </div>
      )}

      <div className="relative w-full h-full">
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`snake-${index}`}
            className={`absolute w-3 h-3 rounded-sm transition-all duration-200 ${
              index === 0 ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${(segment.x * 100) / GRID_WIDTH}%`,
              top: `${(segment.y * 100) / GRID_HEIGHT}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: index === 0 ? colors.head : colors.body,
              background: index === 0 
                ? `linear-gradient(45deg, ${colors.head} 0%, ${colors.head} 40%, #000 45%, ${colors.head} 50%, #000 55%, ${colors.head} 60%, ${colors.head} 100%)`
                : `linear-gradient(45deg, ${colors.body} 0%, ${colors.body} 30%, #000 35%, ${colors.body} 40%, #000 45%, ${colors.body} 50%, #000 55%, ${colors.body} 60%, #000 65%, ${colors.body} 70%, ${colors.body} 100%)`,
              boxShadow: index === 0 
                ? `0 0 6px ${colors.glow}` 
                : `0 0 3px ${colors.glow}`,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
          style={{
            left: `${(food.x * 100) / GRID_WIDTH}%`,
            top: `${(food.y * 100) / GRID_HEIGHT}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 4px #f87171',
          }}
        />

        {/* Score display */}
        <div className="absolute top-4 left-4 text-xs opacity-50" style={{ color: colors.head }}>
          Snake Score: {score}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EnhancedBackgroundSnake);
