import { useState, useCallback, useMemo } from 'react';

const FOODS_PER_SPEED_INCREASE = 3;
const MAX_SPEED_MULTIPLIER = 5;

export const useSurvivalMode = () => {
  const [foodsEaten, setFoodsEaten] = useState(0);

  const speedMultiplier = useMemo(() => {
    const multiplier = 1 + Math.floor(foodsEaten / FOODS_PER_SPEED_INCREASE) * 0.5;
    return Math.min(multiplier, MAX_SPEED_MULTIPLIER);
  }, [foodsEaten]);

  const onFoodEaten = useCallback(() => {
    setFoodsEaten(prev => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setFoodsEaten(0);
  }, []);

  const getSpeedLabel = useCallback(() => {
    if (speedMultiplier >= 4) return '🔥 INSANE';
    if (speedMultiplier >= 3) return '⚡ VERY FAST';
    if (speedMultiplier >= 2) return '🏃 FAST';
    if (speedMultiplier >= 1.5) return '💨 QUICK';
    return '🐌 NORMAL';
  }, [speedMultiplier]);

  return {
    foodsEaten,
    speedMultiplier,
    speedLabel: getSpeedLabel(),
    onFoodEaten,
    reset,
  };
};
