import React, { useEffect, useState, useCallback } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

const EnhancedBackgroundSnake = () => {
  const { settings } = useGameSettings();
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [food, setFood] = useState<Food>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);

  // Reduced grid dimensions for better performance
  const GRID_WIDTH = 30;
  const GRID_HEIGHT = 25;

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

  // Snake movement logic
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
          const grownSnake = [head, ...newSnake];
          setFood(generateFood(grownSnake));
          setScore(prev => prev + 1);
          return grownSnake;
        } else {
          newSnake.unshift(head);
          newSnake.pop();
          return newSnake;
        }
      });
    }, 300); // Slower for better performance

    return () => clearInterval(interval);
  }, [direction, food, generateFood, GRID_WIDTH, GRID_HEIGHT]);

  // Simplified direction change logic
  useEffect(() => {
    const directionInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
        const currentDirection = direction;
        const oppositeDirection = currentDirection === 'up' ? 'down' : 
                                currentDirection === 'down' ? 'up' :
                                currentDirection === 'left' ? 'right' : 'left';
        
        const availableDirections = directions.filter(dir => dir !== oppositeDirection);
        const randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        setDirection(randomDirection);
      }
    }, 3000);

    return () => clearInterval(directionInterval);
  }, [direction]);

  return (
    <div className="fixed inset-0 opacity-40 pointer-events-none overflow-hidden z-0">
      <div className="relative w-full h-full">
        {/* Snake - simplified rendering */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-3 h-3 rounded-sm ${index === 0 ? 'animate-pulse' : ''}`}
            style={{
              left: `${(segment.x * 100) / GRID_WIDTH}%`,
              top: `${(segment.y * 100) / GRID_HEIGHT}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: index === 0 ? settings.snakeColor : settings.snakeBodyColor,
              boxShadow: index === 0 
                ? `0 0 4px ${settings.snakeColor}` 
                : `0 0 2px ${settings.snakeBodyColor}`,
            }}
          />
        ))}

        {/* Food - simplified */}
        <div
          className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
          style={{
            left: `${(food.x * 100) / GRID_WIDTH}%`,
            top: `${(food.y * 100) / GRID_HEIGHT}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 3px #f87171',
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(EnhancedBackgroundSnake);