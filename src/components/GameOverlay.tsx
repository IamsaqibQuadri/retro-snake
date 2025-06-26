
import React from 'react';

interface GameOverlayProps {
  gameOver: boolean;
  score: number;
  highScore: number;
  onNewGame: () => void;
  onBackToMenu: () => void;
  onTakeScreenshot: () => void;
}

const GameOverlay = ({ gameOver, score, highScore, onNewGame, onBackToMenu, onTakeScreenshot }: GameOverlayProps) => {
  if (!gameOver) return null;

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-xl font-bold text-red-400 mb-2">GAME OVER</h2>
      <p className="text-green-400 text-lg mb-2">Score: {score}</p>
      {score === highScore && score > 0 && (
        <p className="text-yellow-400 text-sm mb-3">🏆 NEW HIGH SCORE!</p>
      )}
      <p className="text-green-300 text-xs mb-4">Try again or give up?</p>
      <div className="space-y-2">
        <button
          onClick={onNewGame}
          className="block w-full px-4 py-2 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors text-sm"
        >
          TRY AGAIN
        </button>
        <button
          onClick={onBackToMenu}
          className="block w-full px-4 py-2 border border-red-400 text-red-400 font-bold rounded hover:bg-red-400/10 transition-colors text-sm"
        >
          GIVE UP
        </button>
        <button
          onClick={onTakeScreenshot}
          className="block w-full px-4 py-2 border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400 font-bold rounded hover:bg-yellow-400/20 transition-colors text-sm"
        >
          📸 SAVE SCORE
        </button>
      </div>
    </div>
  );
};

export default GameOverlay;
