
import React, { useEffect, useState } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';

interface SnakeSegment {
  x: number;
  y: number;
}

const BackgroundSnake = () => {
  const { settings } = useGameSettings();
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');

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

        // Wrap around screen (assuming 50x40 grid for better coverage)
        if (head.x < 0) head.x = 49;
        if (head.x > 49) head.x = 0;
        if (head.y < 0) head.y = 39;
        if (head.y > 39) head.y = 0;

        // Add new head and remove tail
        newSnake.unshift(head);
        newSnake.pop();

        return newSnake;
      });
    }, 120); // Slightly faster for more dynamic feel

    return () => clearInterval(interval);
  }, [direction]);

  // Change direction randomly but less frequently
  useEffect(() => {
    const directionInterval = setInterval(() => {
      const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      setDirection(randomDirection);
    }, 3500);

    return () => clearInterval(directionInterval);
  }, []);

  return (
    <div className="fixed inset-0 opacity-50 pointer-events-none overflow-hidden z-0">
      <div className="relative w-full h-full">
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-4 h-4 rounded-sm transition-all duration-200 ${
              index === 0 
                ? 'animate-pulse' 
                : ''
            }`}
            style={{
              left: `${(segment.x * 100) / 50}%`,
              top: `${(segment.y * 100) / 40}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: index === 0 ? settings.snakeColor : settings.snakeBodyColor,
              background: index === 0 
                ? `linear-gradient(45deg, ${settings.snakeColor} 0%, ${settings.snakeColor} 40%, #000 45%, ${settings.snakeColor} 50%, #000 55%, ${settings.snakeColor} 60%, ${settings.snakeColor} 100%)`
                : `linear-gradient(45deg, ${settings.snakeBodyColor} 0%, ${settings.snakeBodyColor} 30%, #000 35%, ${settings.snakeBodyColor} 40%, #000 45%, ${settings.snakeBodyColor} 50%, #000 55%, ${settings.snakeBodyColor} 60%, #000 65%, ${settings.snakeBodyColor} 70%, ${settings.snakeBodyColor} 100%)`,
              boxShadow: index === 0 
                ? `0 0 8px ${settings.snakeColor}` 
                : `0 0 4px ${settings.snakeBodyColor}`,
              
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(BackgroundSnake);
