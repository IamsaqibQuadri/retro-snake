
import React, { useEffect, useState } from 'react';

interface SnakeSegment {
  x: number;
  y: number;
}

const BackgroundSnake = () => {
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');

  useEffect(() => {
    console.log('BackgroundSnake: Starting animation');
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
      console.log('BackgroundSnake: Changing direction to:', randomDirection);
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
              backgroundColor: index === 0 ? '#22c55e' : '#16a34a', // Same green as in-game snake
              background: index === 0 
                ? 'linear-gradient(45deg, #22c55e 0%, #22c55e 40%, #000 45%, #22c55e 50%, #000 55%, #22c55e 60%, #22c55e 100%)'
                : 'linear-gradient(45deg, #16a34a 0%, #16a34a 30%, #000 35%, #16a34a 40%, #000 45%, #16a34a 50%, #000 55%, #16a34a 60%, #000 65%, #16a34a 70%, #16a34a 100%)',
              boxShadow: index === 0 
                ? '0 0 8px #22c55e, 0 0 16px rgba(34, 197, 94, 0.6)' 
                : '0 0 4px #16a34a, 0 0 8px rgba(22, 163, 74, 0.4)',
              filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.7))',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(BackgroundSnake);
