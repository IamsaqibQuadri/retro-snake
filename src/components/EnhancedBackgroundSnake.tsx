
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

interface MatrixStream {
  id: number;
  x: number;
  y: number;
  chars: string[];
  speed: number;
  length: number;
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
  const [matrixStreams, setMatrixStreams] = useState<MatrixStream[]>([]);

  // Grid dimensions for better coverage
  const GRID_WIDTH = 50;
  const GRID_HEIGHT = 40;

  // Matrix characters - katakana, numbers, symbols
  const MATRIX_CHARS = 'ァアィイゥウェエォオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789アイウエオカキクケコ';

  // Generate random characters for a stream
  const generateStreamChars = (length: number) => {
    return Array.from({ length }, () => 
      MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    );
  };

  // Initialize matrix rain streams
  useEffect(() => {
    if (theme === 'matrix') {
      const columns = Math.floor(window.innerWidth / 18);
      const streams: MatrixStream[] = [];
      
      for (let i = 0; i < columns; i++) {
        const length = 8 + Math.floor(Math.random() * 20);
        streams.push({
          id: i,
          x: i * 18,
          y: Math.random() * window.innerHeight * 2 - window.innerHeight,
          chars: generateStreamChars(length),
          speed: 1 + Math.random() * 3,
          length,
        });
      }
      setMatrixStreams(streams);
    }
  }, [theme]);

  // Matrix rain animation with character changes
  useEffect(() => {
    if (theme !== 'matrix') return;

    const interval = setInterval(() => {
      setMatrixStreams(prev => prev.map(stream => {
        let newY = stream.y + stream.speed;
        
        // Reset stream when it goes off screen
        if (newY > window.innerHeight + stream.length * 18) {
          const newLength = 8 + Math.floor(Math.random() * 20);
          return {
            ...stream,
            y: -newLength * 18,
            chars: generateStreamChars(newLength),
            speed: 1 + Math.random() * 3,
            length: newLength,
          };
        }
        
        // Randomly change some characters in the stream
        const newChars = stream.chars.map(c => 
          Math.random() < 0.02 ? MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] : c
        );
        
        return { ...stream, y: newY, chars: newChars };
      }));
    }, 40);

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
      {/* Matrix falling code effect - authentic streams */}
      {theme === 'matrix' && (
        <div className="absolute inset-0 overflow-hidden">
          {matrixStreams.map(stream => (
            <div
              key={stream.id}
              className="absolute"
              style={{
                left: stream.x,
                top: stream.y,
              }}
            >
              {stream.chars.map((char, idx) => {
                const isHead = idx === 0;
                const tailFade = Math.max(0.1, 1 - (idx / stream.length) * 0.9);
                return (
                  <div
                    key={idx}
                    className="font-mono text-sm leading-tight"
                    style={{
                      color: isHead ? '#ffffff' : `rgba(0, 255, 0, ${tailFade})`,
                      textShadow: isHead 
                        ? '0 0 10px #fff, 0 0 20px #00ff00, 0 0 30px #00ff00' 
                        : `0 0 ${8 * tailFade}px #00ff00`,
                      fontSize: '14px',
                      lineHeight: '18px',
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          ))}
          {/* CRT scanline overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)',
              mixBlendMode: 'overlay',
            }}
          />
          {/* Slight vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
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

        {/* Score display - using darker color for better contrast */}
        <div className="absolute top-4 left-4 text-xs text-muted-foreground/70">
          Snake Score: {score}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EnhancedBackgroundSnake);
