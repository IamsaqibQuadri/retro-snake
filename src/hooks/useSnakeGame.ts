
import { useState, useEffect, useCallback, useRef } from 'react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
}

const GRID_WIDTH = 15;
const GRID_HEIGHT = 15;

const SPEED_INTERVALS = {
  slow: 200,
  normal: 150,
  fast: 100,
};

export const useSnakeGame = (speed: 'slow' | 'normal' | 'fast') => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 7, y: 7 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const directionRef = useRef<Direction>('RIGHT');

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((snake: Position[]): Position => {
    let food: Position;
    do {
      food = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      return true;
    }
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Move snake
  const moveSnake = useCallback((newDirection: Direction) => {
    if (gameOver) return;

    // Prevent reverse direction
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    if (opposites[newDirection] !== directionRef.current) {
      directionRef.current = newDirection;
      setGameState(prev => ({ ...prev, direction: newDirection }));
    }
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      setGameState(prevState => {
        const { snake, food } = prevState;
        const direction = directionRef.current;

        // Calculate new head position
        const head = { ...snake[0] };
        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check collision
        if (checkCollision(head, snake)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevState;
        }

        const newSnake = [head, ...snake];

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          
          // Update high score
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake-high-score', newScore.toString());
          }

          return {
            ...prevState,
            snake: newSnake,
            food: generateFood(newSnake),
            direction,
          };
        } else {
          // Remove tail if no food eaten
          newSnake.pop();
          return {
            ...prevState,
            snake: newSnake,
            direction,
          };
        }
      });
    };

    gameLoopRef.current = setInterval(gameLoop, SPEED_INTERVALS[speed]);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, score, highScore, speed, checkCollision, generateFood]);

  // Reset game
  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'RIGHT',
    });
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, [generateFood]);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPlaying(prev => !prev);
    }
  }, [gameOver]);

  return {
    gameState,
    score,
    highScore,
    gameOver,
    isPlaying,
    direction: directionRef.current,
    moveSnake,
    resetGame,
    togglePause,
  };
};
