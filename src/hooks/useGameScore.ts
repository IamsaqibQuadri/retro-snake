
import { useState, useEffect } from 'react';
import { HIGH_SCORE_KEY, SCORE_PER_FOOD } from '../constants/gameConstants';
import { logger } from '../utils/logger';

export const useGameScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const increaseScore = () => {
    setScore(prevScore => {
      const newScore = prevScore + SCORE_PER_FOOD;
      logger.log('New score:', newScore);
      
      // Update high score
      setHighScore(prevHighScore => {
        if (newScore > prevHighScore) {
          localStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
          return newScore;
        }
        return prevHighScore;
      });
      
      return newScore;
    });
  };

  const resetScore = () => {
    setScore(0);
  };

  return {
    score,
    highScore,
    increaseScore,
    resetScore,
  };
};
