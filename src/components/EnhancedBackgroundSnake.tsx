
import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

const EnhancedBackgroundSnake = () => {
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

  // Grid dimensions for better coverage
  const GRID_WIDTH = 50;
  const GRID_HEIGHT = 40;

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

  // Memoized direction changes to reduce frequency
  const shouldChangeDirection = useMemo(() => Math.random() < 0.05, []);

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
          newSnake.unshift(head);
          setFood(generateFood(newSnake));
          setScore(prev => prev + 1);
        } else {
          // Move snake normally
          newSnake.unshift(head);
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150); // Optimized speed

    return () => clearInterval(interval);
  }, [direction, food, generateFood, GRID_WIDTH, GRID_HEIGHT]);

  // Direction change logic - less frequent for better performance
  useEffect(() => {
    const directionInterval = setInterval(() => {
      if (shouldChangeDirection) {
        const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        setDirection(randomDirection);
      }
    }, 4000); // Less frequent changes

    return () => clearInterval(directionInterval);
  }, [shouldChangeDirection]);

  return (
    <div className="fixed inset-0 opacity-50 pointer-events-none overflow-hidden z-0">
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
              backgroundColor: index === 0 ? '#22c55e' : '#16a34a',
              background: index === 0 
                ? 'linear-gradient(45deg, #22c55e 0%, #22c55e 40%, #000 45%, #22c55e 50%, #000 55%, #22c55e 60%, #22c55e 100%)'
                : 'linear-gradient(45deg, #16a34a 0%, #16a34a 30%, #000 35%, #16a34a 40%, #000 45%, #16a34a 50%, #000 55%, #16a34a 60%, #000 65%, #16a34a 70%, #16a34a 100%)',
              boxShadow: index === 0 
                ? '0 0 6px #22c55e' 
                : '0 0 3px #16a34a',
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
        <div className="absolute top-4 left-4 text-green-400 text-xs opacity-50">
          Snake Score: {score}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EnhancedBackgroundSnake);
