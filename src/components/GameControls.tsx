import React, { useEffect, useRef, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  disabled: boolean;
}

const GameControls = ({ onDirectionChange, disabled }: GameControlsProps) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleButtonClick = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!disabled) {
      onDirectionChange(direction);
    }
  }, [onDirectionChange, disabled]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      
      let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          direction = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          direction = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          direction = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          direction = 'RIGHT';
          break;
      }
      
      if (direction) {
        onDirectionChange(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onDirectionChange, disabled]);

  // Touch/Swipe controls for the entire screen
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (disabled) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (disabled || !touchStartRef.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipeDistance = 50;

      let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          direction = deltaY > 0 ? 'DOWN' : 'UP';
        }
      }
      
      if (direction) {
        onDirectionChange(direction);
      }
      
      touchStartRef.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDirectionChange, disabled]);

  const buttonClass = `w-16 h-16 border-2 border-primary bg-primary/10 text-primary rounded-lg flex items-center justify-center active:bg-primary/20 transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/15'
  }`;

  return (
    <div className="mt-8 select-none">
      {/* Button controls only */}
      <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
        <div></div>
        <button
          className={buttonClass}
          onClick={() => handleButtonClick('UP')}
          disabled={disabled}
        >
          <ArrowUp size={24} />
        </button>
        <div></div>

        <button
          className={buttonClass}
          onClick={() => handleButtonClick('LEFT')}
          disabled={disabled}
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center justify-center text-muted-foreground text-xs">
          MOVE
        </div>
        <button
          className={buttonClass}
          onClick={() => handleButtonClick('RIGHT')}
          disabled={disabled}
        >
          <ArrowRight size={24} />
        </button>

        <div></div>
        <button
          className={buttonClass}
          onClick={() => handleButtonClick('DOWN')}
          disabled={disabled}
        >
          <ArrowDown size={24} />
        </button>
        <div></div>
      </div>

      <div className="text-center mt-4 text-muted-foreground text-xs">
        Use WASD keys, arrow keys, or swipe anywhere on screen
      </div>
    </div>
  );
};

export default React.memo(GameControls);