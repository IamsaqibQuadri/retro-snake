
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
  slow: 300,
  normal: 180,
  fast: 120,
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

  // Generate random food position - improved algorithm
  const generateFood = useCallback((snake: Position[]): Position => {
    console.log('Generating food, snake length:', snake.length);
    
    // Create array of all possible positions
    const allPositions: Position[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        allPositions.push({ x, y });
      }
    }
    
    // Filter out positions occupied by snake
    const availablePositions = allPositions.filter(pos => 
      !snake.some(segment => segment.x === pos.x && segment.y === pos.y)
    );
    
    console.log('Available positions for food:', availablePositions.length);
    
    // If no positions available (shouldn't happen in normal game), return a position
    if (availablePositions.length === 0) {
      console.log('No available positions! Game should end.');
      return { x: 0, y: 0 };
    }
    
    // Select random position from available ones
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const newFood = availablePositions[randomIndex];
    
    console.log('New food position:', newFood);
    return newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    console.log('Checking collision for head position:', head);
    
    // Wall collision - check if head is at or beyond boundaries
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      console.log('Wall collision detected');
      return true;
    }
    
    // Self collision
    const selfCollision = snake.some(segment => segment.x === head.x && segment.y === head.y);
    if (selfCollision) {
      console.log('Self collision detected');
    }
    
    return selfCollision;
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

        console.log('New head position:', head, 'Direction:', direction);

        // Check collision BEFORE updating state
        if (checkCollision(head, snake)) {
          console.log('Game over due to collision');
          setGameOver(true);
          setIsPlaying(false);
          return prevState;
        }

        const newSnake = [head, ...snake];

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          console.log('Food eaten! Score increasing...');
          
          setScore(prevScore => {
            const newScore = prevScore + 10;
            console.log('New score:', newScore);
            
            // Update high score
            setHighScore(prevHighScore => {
              if (newScore > prevHighScore) {
                localStorage.setItem('snake-high-score', newScore.toString());
                return newScore;
              }
              return prevHighScore;
            });
            
            return newScore;
          });

          // Generate new food
          const newFood = generateFood(newSnake);
          console.log('Generated new food at:', newFood);

          return {
            ...prevState,
            snake: newSnake,
            food: newFood,
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
  }, [isPlaying, gameOver, speed, checkCollision, generateFood]);

  // Reset game
  const resetGame = useCallback(() => {
    console.log('Resetting game...');
    const initialSnake = [{ x: 7, y: 7 }];
    const initialFood = generateFood(initialSnake);
    
    setGameState({
      snake: initialSnake,
      food: initialFood,
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
