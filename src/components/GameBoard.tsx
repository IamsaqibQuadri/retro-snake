
import React from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSnakeSkin } from '../contexts/SnakeSkinContext';
import { Position, Direction } from '../types/gameTypes';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  direction: Direction;
  foodEaten: boolean;
  gameWidth: number;
  gameHeight: number;
  gridSize: number;
}

const GameBoard = ({ snake, food, direction, foodEaten, gameWidth, gameHeight, gridSize }: GameBoardProps) => {
  const { settings } = useGameSettings();
  const { theme } = useTheme();
  const { snakeSkin } = useSnakeSkin();

  // Snake head with tongue effect and eating glow
  const renderSnakeHead = (segment: Position, index: number) => {
    let tongueStyle: React.CSSProperties = {};
    
    switch (direction) {
      case 'UP':
        tongueStyle = { top: -4, left: '50%', transform: 'translateX(-50%)', width: 2, height: 6 };
        break;
      case 'DOWN':
        tongueStyle = { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 2, height: 6 };
        break;
      case 'LEFT':
        tongueStyle = { left: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 2 };
        break;
      case 'RIGHT':
        tongueStyle = { right: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 2 };
        break;
    }

    const getSnakeHeadStyle = () => {
      if (snakeSkin === 'classic') {
        // Dice snake head - shows dice number 1
        return {
          left: segment.x * gridSize,
          top: segment.y * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: settings.snakeColor,
          position: 'relative' as const,
          imageRendering: 'pixelated' as const,
          border: '3px solid #000000',
          boxShadow: foodEaten ? `0 0 8px ${settings.snakeColor}` : 'inset 2px 2px 0 rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.max(gridSize * 0.9, 16)}px`, // Much larger font size
          fontWeight: 'bold',
          color: '#000000', // Black dice symbols for visibility
          textShadow: '2px 2px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff', // White outline for contrast
        };
      } else if (snakeSkin === 'tetris') {
        // Tetris block style
        return {
          left: segment.x * gridSize,
          top: segment.y * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: settings.snakeColor,
          position: 'relative' as const,
          imageRendering: 'pixelated' as const,
          border: '1px solid #000',
          boxShadow: foodEaten ? `0 0 8px ${settings.snakeColor}` : 'inset 2px 2px 0 rgba(255,255,255,0.6), inset -2px -2px 0 rgba(0,0,0,0.6)',
        };
      } else {
        // Modern remix snake - gradient design
        return {
          left: segment.x * gridSize,
          top: segment.y * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: settings.snakeColor,
          position: 'relative' as const,
          background: `linear-gradient(45deg, ${settings.snakeColor} 0%, ${settings.snakeColor} 40%, #000 45%, ${settings.snakeColor} 50%, #000 55%, ${settings.snakeColor} 60%, ${settings.snakeColor} 100%)`,
          boxShadow: foodEaten ? `0 0 10px ${settings.snakeColor}` : 'none',
        };
      }
    };

    return (
      <div
        key={index}
        className={`absolute transition-all duration-300 ${foodEaten ? 'animate-pulse scale-110' : ''}`}
        style={getSnakeHeadStyle()}
      >
        {snakeSkin === 'classic' && '⚀'}
        {snakeSkin === 'remix' && (
          <div
            className="absolute bg-red-500 animate-pulse"
            style={tongueStyle}
          />
        )}
        {snakeSkin === 'classic' && (
          <div
            className="absolute bg-red-600"
            style={{
              ...tongueStyle,
              imageRendering: 'pixelated',
            }}
          />
        )}
      </div>
    );
  };

  // Snake body with tattoo pattern and eating wiggle
  const renderSnakeBody = (segment: Position, index: number) => {
    const getSnakeBodyStyle = () => {
      if (snakeSkin === 'classic') {
        // Dice snake body - each segment shows a different dice number
        return {
          left: segment.x * gridSize,
          top: segment.y * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: settings.snakeBodyColor,
          imageRendering: 'pixelated' as const,
          border: '3px solid #000000',
          boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.2)',
          animationDelay: `${index * 50}ms`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.max(gridSize * 0.9, 16)}px`, // Much larger font size for better visibility
          fontWeight: 'bold',
          color: '#000000', // Black dice symbols for maximum visibility
          textShadow: '2px 2px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff', // White outline for contrast
        };
      } else if (snakeSkin === 'tetris') {
        // Tetris block style
        return {
          left: segment.x * gridSize,
          top: segment.y * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: settings.snakeBodyColor,
          imageRendering: 'pixelated' as const,
          border: '1px solid #000',
          boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.4)',
          animationDelay: `${index * 50}ms`,
        };
      } else {
        // Modern remix snake body - gradient pattern
        return {
          left: segment.x * gridSize,
          top: segment.y * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: settings.snakeBodyColor,
          background: `linear-gradient(45deg, ${settings.snakeBodyColor} 0%, ${settings.snakeBodyColor} 30%, #000 35%, ${settings.snakeBodyColor} 40%, #000 45%, ${settings.snakeBodyColor} 50%, #000 55%, ${settings.snakeBodyColor} 60%, #000 65%, ${settings.snakeBodyColor} 70%, ${settings.snakeBodyColor} 100%)`,
          animationDelay: `${index * 50}ms`,
        };
      }
    };

    const diceNumber = (index + 1) % 6 + 1; // Get dice number 1-6
    const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    
    return (
      <div
        key={index}
        className={`absolute transition-all duration-200 ${foodEaten ? 'animate-bounce' : ''}`}
        style={getSnakeBodyStyle()}
      >
        {snakeSkin === 'classic' && diceSymbols[diceNumber - 1]}
      </div>
    );
  };

  // Using design system tokens for consistent theming
  const boardStyles = 'bg-card border-border';

  return (
    <div className={`relative border-2 ${boardStyles} rounded-lg overflow-hidden`} 
         style={{ width: gameWidth, height: gameHeight }}>
      
      {/* Snake */}
      {snake.map((segment, index) => 
        index === 0 ? renderSnakeHead(segment, index) : renderSnakeBody(segment, index)
      )}

      {/* Food with enhanced animation */}
      <div
        className="absolute bg-red-400 rounded-full animate-pulse"
        style={{
          left: food.x * gridSize,
          top: food.y * gridSize,
          width: gridSize,
          height: gridSize,
          boxShadow: '0 0 8px #f87171',
        }}
      />
    </div>
  );
};

export default GameBoard;
