import { useState, useEffect, useCallback, useRef } from 'react';

const TIME_ATTACK_DURATION = 60; // 60 seconds

export const useTimeAttack = (isPlaying: boolean, gameOver: boolean) => {
  const [timeRemaining, setTimeRemaining] = useState(TIME_ATTACK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when game starts
  useEffect(() => {
    if (isPlaying && !gameOver && !isActive) {
      setIsActive(true);
    }
  }, [isPlaying, gameOver, isActive]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || gameOver) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, gameOver]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeRemaining(TIME_ATTACK_DURATION);
    setIsActive(false);
  }, []);

  const isTimeUp = timeRemaining <= 0;

  return {
    timeRemaining,
    isActive,
    isTimeUp,
    reset,
  };
};
