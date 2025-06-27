
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

        // Wrap around screen (assuming 40x30 grid)
        if (head.x < 0) head.x = 39;
        if (head.x > 39) head.x = 0;
        if (head.y < 0) head.y = 29;
        if (head.y > 29) head.y = 0;

        // Add new head and remove tail
        newSnake.unshift(head);
        newSnake.pop();

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction]);

  // Change direction randomly
  useEffect(() => {
    const directionInterval = setInterval(() => {
      const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      setDirection(randomDirection);
    }, 3000);

    return () => clearInterval(directionInterval);
  }, []);

  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
      <div className="relative w-full h-full">
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-2 h-2 rounded-sm transition-all duration-200 ${
              index === 0 ? 'bg-green-400' : 'bg-green-600'
            }`}
            style={{
              left: `${(segment.x * 100) / 40}%`,
              top: `${(segment.y * 100) / 30}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(BackgroundSnake);
