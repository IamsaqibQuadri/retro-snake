
import React, { useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  disabled: boolean;
}

const GameControls = ({ onDirectionChange, disabled }: GameControlsProps) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          onDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          onDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          onDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          onDirectionChange('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onDirectionChange, disabled]);

  // Touch/Swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        onDirectionChange(deltaX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        onDirectionChange(deltaY > 0 ? 'DOWN' : 'UP');
      }
    }
    
    touchStartRef.current = null;
  };

  const buttonClass = `w-16 h-16 border-2 border-green-400 bg-green-400/10 text-green-400 rounded-lg flex items-center justify-center active:bg-green-400/20 transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-400/15'
  }`;

  return (
    <div className="mt-8 select-none">
      {/* Swipe area */}
      <div
        className="w-full h-20 mb-4 border-2 border-dashed border-green-400/30 rounded-lg flex items-center justify-center text-green-300 text-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        📱 Swipe here to control
      </div>

      {/* Button controls */}
      <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
        <div></div>
        <button
          className={buttonClass}
          onClick={() => !disabled && onDirectionChange('UP')}
          disabled={disabled}
        >
          <ArrowUp size={24} />
        </button>
        <div></div>

        <button
          className={buttonClass}
          onClick={() => !disabled && onDirectionChange('LEFT')}
          disabled={disabled}
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center justify-center text-green-300 text-xs">
          MOVE
        </div>
        <button
          className={buttonClass}
          onClick={() => !disabled && onDirectionChange('RIGHT')}
          disabled={disabled}
        >
          <ArrowRight size={24} />
        </button>

        <div></div>
        <button
          className={buttonClass}
          onClick={() => !disabled && onDirectionChange('DOWN')}
          disabled={disabled}
        >
          <ArrowDown size={24} />
        </button>
        <div></div>
      </div>

      <div className="text-center mt-4 text-green-300 text-xs">
        Use WASD keys or arrow keys on desktop
      </div>
    </div>
  );
};

export default GameControls;
