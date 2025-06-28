
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
    }, 150); // Slightly faster for more dynamic feel

    return () => clearInterval(interval);
  }, [direction]);

  // Change direction randomly but less frequently
  useEffect(() => {
    const directionInterval = setInterval(() => {
      const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      setDirection(randomDirection);
    }, 4000);

    return () => clearInterval(directionInterval);
  }, []);

  return (
    <div className="fixed inset-0 opacity-30 pointer-events-none overflow-hidden z-0">
      <div className="relative w-full h-full">
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-3 h-3 rounded-sm transition-all duration-200 ${
              index === 0 
                ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                : 'bg-green-500 shadow-md shadow-green-500/30'
            }`}
            style={{
              left: `${(segment.x * 100) / 50}%`,
              top: `${(segment.y * 100) / 40}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(BackgroundSnake);
