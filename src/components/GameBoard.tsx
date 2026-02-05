import React, { useRef, useEffect } from 'react';
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
  obstacles?: Position[];
}

const GameBoard = ({ snake, food, direction, foodEaten, gameWidth, gameHeight, gridSize, obstacles = [] }: GameBoardProps) => {
  const { settings } = useGameSettings();
  const { theme } = useTheme();
  const { snakeSkin } = useSnakeSkin();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Wind skin canvas rendering with robust error handling
  useEffect(() => {
    if (snakeSkin !== 'wind' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      ctx.clearRect(0, 0, gameWidth, gameHeight);
      
      // Handle single segment (just a circle) - smoky gray-blue
      if (snake.length === 1) {
        const point = snake[0];
        ctx.save();
        ctx.fillStyle = 'rgba(180, 200, 220, 0.85)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(150, 170, 190, 0.7)';
        ctx.beginPath();
        ctx.arc(
          point.x * gridSize + gridSize / 2,
          point.y * gridSize + gridSize / 2,
          gridSize * 0.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
        return;
      }

      // Create path through segment centers
      const points = snake.map(seg => ({
        x: seg.x * gridSize + gridSize / 2,
        y: seg.y * gridSize + gridSize / 2,
      }));

      // Draw multiple passes for smoky glow effect
      const passes = [
        { blur: 20, alpha: 0.15, width: gridSize * 1.8 },
        { blur: 12, alpha: 0.25, width: gridSize * 1.4 },
        { blur: 6, alpha: 0.4, width: gridSize * 1.0 },
        { blur: 2, alpha: 0.7, width: gridSize * 0.7 },
      ];

      passes.forEach(pass => {
        ctx.save();
        ctx.shadowBlur = pass.blur;
        ctx.shadowColor = 'rgba(150, 170, 190, 0.5)';  // Soft gray-blue glow
        ctx.strokeStyle = `rgba(180, 200, 220, ${pass.alpha})`;  // Smoky gray-blue
        ctx.lineWidth = pass.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        // Handle exactly 2 points (straight line)
        if (points.length === 2) {
          ctx.lineTo(points[1].x, points[1].y);
        } else {
          // 3+ points: use smooth curves
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          // Connect to last point
          ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        }

        ctx.stroke();
        ctx.restore();
      });

      // Draw head glow - softer, smokier
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(200, 215, 230, 0.7)';
      ctx.fillStyle = 'rgba(200, 215, 230, 0.85)';
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, gridSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } catch (error) {
      console.error('Wind skin rendering error:', error);
    }
  }, [snake, snakeSkin, gridSize, gameWidth, gameHeight]);

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
      const baseStyle = {
        left: segment.x * gridSize,
        top: segment.y * gridSize,
        width: gridSize,
        height: gridSize,
        position: 'relative' as const,
      };

      switch (snakeSkin) {
        case 'classic':
          return {
            ...baseStyle,
            backgroundColor: settings.snakeColor,
            imageRendering: 'pixelated' as const,
            border: '3px solid #000000',
            boxShadow: foodEaten ? `0 0 8px ${settings.snakeColor}` : 'inset 2px 2px 0 rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.max(gridSize * 0.9, 16)}px`,
            fontWeight: 'bold',
            color: '#000000',
            textShadow: '2px 2px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff',
          };
        case 'tetris':
          return {
            ...baseStyle,
            backgroundColor: settings.snakeColor,
            imageRendering: 'pixelated' as const,
            border: '1px solid #000',
            boxShadow: foodEaten ? `0 0 8px ${settings.snakeColor}` : 'inset 2px 2px 0 rgba(255,255,255,0.6), inset -2px -2px 0 rgba(0,0,0,0.6)',
          };
        case 'neon':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            border: `2px solid ${settings.snakeColor}`,
            boxShadow: `0 0 10px ${settings.snakeColor}, inset 0 0 10px ${settings.snakeColor}, 0 0 20px ${settings.snakeColor}`,
          };
        case 'rainbow':
          const hue = (Date.now() / 10) % 360;
          return {
            ...baseStyle,
            background: `linear-gradient(45deg, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`,
            boxShadow: foodEaten ? `0 0 15px hsl(${hue}, 100%, 50%)` : `0 0 8px hsl(${hue}, 100%, 50%)`,
          };
        case 'fire':
          return {
            ...baseStyle,
            background: 'linear-gradient(180deg, #ff4500 0%, #ff6b00 30%, #ffa500 60%, #ffcc00 100%)',
            boxShadow: foodEaten ? '0 0 15px #ff4500, 0 0 25px #ff6b00' : '0 0 8px #ff4500, 0 0 15px #ff6b00',
          };
        case 'ice':
          return {
            ...baseStyle,
            background: 'linear-gradient(180deg, #e0f7ff 0%, #87ceeb 30%, #00bfff 60%, #1e90ff 100%)',
            boxShadow: foodEaten ? '0 0 15px #00bfff, 0 0 25px #87ceeb' : '0 0 8px #00bfff',
            border: '1px solid rgba(255,255,255,0.5)',
          };
        case 'wind':
          // Wind skin uses canvas, hide DOM element
          return {
            ...baseStyle,
            opacity: 0,
          };
        default: // remix
          return {
            ...baseStyle,
            backgroundColor: settings.snakeColor,
            background: `linear-gradient(45deg, ${settings.snakeColor} 0%, ${settings.snakeColor} 40%, #000 45%, ${settings.snakeColor} 50%, #000 55%, ${settings.snakeColor} 60%, ${settings.snakeColor} 100%)`,
            boxShadow: foodEaten ? `0 0 10px ${settings.snakeColor}` : 'none',
          };
      }
    };

    return (
      <div
        key={index}
        className={`absolute transition-all duration-300 ${foodEaten && snakeSkin !== 'wind' ? 'animate-pulse scale-110' : ''}`}
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
    const baseStyle = {
      left: segment.x * gridSize,
      top: segment.y * gridSize,
      width: gridSize,
      height: gridSize,
      animationDelay: `${index * 50}ms`,
    };

    const getSnakeBodyStyle = () => {
      switch (snakeSkin) {
        case 'classic':
          return {
            ...baseStyle,
            backgroundColor: settings.snakeBodyColor,
            imageRendering: 'pixelated' as const,
            border: '3px solid #000000',
            boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.max(gridSize * 0.9, 16)}px`,
            fontWeight: 'bold',
            color: '#000000',
            textShadow: '2px 2px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff',
          };
        case 'tetris':
          return {
            ...baseStyle,
            backgroundColor: settings.snakeBodyColor,
            imageRendering: 'pixelated' as const,
            border: '1px solid #000',
            boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.4)',
          };
        case 'neon':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            border: `2px solid ${settings.snakeBodyColor}`,
            boxShadow: `0 0 8px ${settings.snakeBodyColor}, inset 0 0 8px ${settings.snakeBodyColor}`,
          };
        case 'rainbow':
          const hue = ((Date.now() / 10) + index * 30) % 360;
          return {
            ...baseStyle,
            background: `linear-gradient(45deg, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`,
            boxShadow: `0 0 5px hsl(${hue}, 100%, 50%)`,
          };
        case 'fire':
          const fireIntensity = Math.max(0.4, 1 - index * 0.1);
          return {
            ...baseStyle,
            background: `linear-gradient(180deg, rgba(255,69,0,${fireIntensity}) 0%, rgba(255,107,0,${fireIntensity}) 30%, rgba(255,165,0,${fireIntensity}) 60%, rgba(255,204,0,${fireIntensity}) 100%)`,
            boxShadow: `0 0 ${5 + (5 - index) * 2}px rgba(255,69,0,${fireIntensity})`,
          };
        case 'ice':
          const iceOpacity = Math.max(0.5, 1 - index * 0.08);
          return {
            ...baseStyle,
            background: `linear-gradient(180deg, rgba(224,247,255,${iceOpacity}) 0%, rgba(135,206,235,${iceOpacity}) 30%, rgba(0,191,255,${iceOpacity}) 60%, rgba(30,144,255,${iceOpacity}) 100%)`,
            boxShadow: `0 0 6px rgba(0,191,255,${iceOpacity})`,
            border: '1px solid rgba(255,255,255,0.3)',
          };
        case 'wind':
          // Wind skin uses canvas, hide DOM element
          return {
            ...baseStyle,
            opacity: 0,
          };
        default: // remix
          return {
            ...baseStyle,
            backgroundColor: settings.snakeBodyColor,
            background: `linear-gradient(45deg, ${settings.snakeBodyColor} 0%, ${settings.snakeBodyColor} 30%, #000 35%, ${settings.snakeBodyColor} 40%, #000 45%, ${settings.snakeBodyColor} 50%, #000 55%, ${settings.snakeBodyColor} 60%, #000 65%, ${settings.snakeBodyColor} 70%, ${settings.snakeBodyColor} 100%)`,
          };
      }
    };

    const diceNumber = (index + 1) % 6 + 1;
    const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    
    return (
      <div
        key={index}
        className={`absolute transition-all duration-200 ${foodEaten && snakeSkin !== 'wind' ? 'animate-bounce' : ''}`}
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
      
      {/* Wind skin canvas overlay */}
      {snakeSkin === 'wind' && (
        <canvas
          ref={canvasRef}
          width={gameWidth}
          height={gameHeight}
          className="absolute inset-0 z-10 pointer-events-none"
        />
      )}
      
      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <div
          key={`obstacle-${index}`}
          className="absolute bg-red-600 border border-red-800"
          style={{
            left: obstacle.x * gridSize,
            top: obstacle.y * gridSize,
            width: gridSize,
            height: gridSize,
            boxShadow: '0 0 8px rgba(220, 38, 38, 0.5)',
          }}
        />
      ))}
      
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
