import { useState, useEffect, useCallback, useRef } from 'react';

export const useGameTimer = (initialTime: number, isPlaying: boolean, gameOver: boolean) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer
  const resetTimer = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsTimeUp(false);
  }, [initialTime]);

  // Timer countdown effect
  useEffect(() => {
    if (!isPlaying || gameOver || isTimeUp) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, gameOver, isTimeUp]);

  return {
    timeRemaining,
    isTimeUp,
    resetTimer,
  };
};
