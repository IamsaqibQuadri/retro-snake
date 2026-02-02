import React, { useState, useCallback, useEffect } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

interface OceanRippleEffectProps {
  isActive: boolean;
}

const OceanRippleEffect = ({ isActive }: OceanRippleEffectProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [nextId, setNextId] = useState(0);

  const createRipple = useCallback((x: number, y: number) => {
    const newRipple: Ripple = {
      id: nextId,
      x,
      y,
      createdAt: Date.now(),
    };
    setRipples(prev => [...prev, newRipple]);
    setNextId(prev => prev + 1);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  }, [nextId]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only create ripple occasionally to prevent too many
    if (Math.random() > 0.85) {
      createRipple(e.clientX, e.clientY);
    }
  }, [createRipple]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e.clientX, e.clientY);
  }, [createRipple]);

  // Touch support
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0 && Math.random() > 0.85) {
      const touch = e.touches[0];
      createRipple(touch.clientX, touch.clientY);
    }
  }, [createRipple]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-auto overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none' }}
    >
      {/* Water surface gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(210, 80%, 20%) 50%, hsl(210, 90%, 10%) 100%)',
        }}
      />
      
      {/* Animated waves */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute w-full h-full"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                hsl(190, 100%, 50%, 0.1) 50px,
                hsl(190, 100%, 50%, 0.1) 100px
              )
            `,
            animation: 'wave 3s linear infinite',
          }}
        />
      </div>

      {/* Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Multiple expanding circles for ripple effect */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: 0,
                height: 0,
                transform: 'translate(-50%, -50%)',
                border: '2px solid hsl(190, 100%, 60%)',
                animation: `ripple-expand 2s ease-out ${i * 0.2}s forwards`,
                opacity: 0.6 - i * 0.15,
              }}
            />
          ))}
        </div>
      ))}

      {/* CSS for ripple animation */}
      <style>{`
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.8;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100px);
          }
        }
      `}</style>
    </div>
  );
};

export default OceanRippleEffect;
