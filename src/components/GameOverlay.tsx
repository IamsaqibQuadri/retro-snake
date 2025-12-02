import React, { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useGlobalLeaderboard } from '../hooks/useGlobalLeaderboard';
import ShareScoreCard from './ShareScoreCard';

// Lazy load PlayerNameDialog for better performance
const PlayerNameDialog = React.lazy(() => import('./PlayerNameDialog'));

interface GameOverlayProps {
  gameOver: boolean;
  score: number;
  highScore: number;
  gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';
  speed: 'slow' | 'normal' | 'fast';
  onNewGame: () => void;
  onBackToMenu: () => void;
  onTakeScreenshot: () => void;
}

const GameOverlay = ({ gameOver, score, highScore, gameMode, speed, onNewGame, onBackToMenu, onTakeScreenshot }: GameOverlayProps) => {
  const { theme } = useTheme();
  const { addScore } = useGlobalLeaderboard();
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [savedPlayerName, setSavedPlayerName] = useState('');
  
  const getOverlayBg = useCallback(() => {
    switch (theme) {
      case 'light': return 'bg-white/95 backdrop-blur-md';
      case 'dark': return 'bg-black/90 backdrop-blur-md';
      case 'pastel': return 'bg-white/95 backdrop-blur-md';
      case 'gameboy': return 'bg-card/95 backdrop-blur-md';
      default: return 'bg-background/90 backdrop-blur-md';
    }
  }, [theme]);

  const handleSaveScore = useCallback(() => {
    setShowNameDialog(true);
  }, []);

  const handleNameSave = useCallback(async (playerName: string) => {
    await addScore(playerName, score, gameMode, speed);
    setSavedPlayerName(playerName);
    setShowNameDialog(false);
    setShowShareCard(true);
  }, [addScore, score, gameMode, speed]);

  const handleNameCancel = useCallback(() => {
    setShowNameDialog(false);
  }, []);
  
  if (!gameOver) return null;

  return (
    <>
      <div className={`absolute inset-0 ${getOverlayBg()} backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-50`}>
        <h2 className="text-xl font-bold text-destructive mb-2">GAME OVER</h2>
        <p className="text-primary text-lg mb-2">Score: {score}</p>
        {score === highScore && score > 0 && (
          <p className="text-accent text-sm mb-3">🏆 NEW HIGH SCORE!</p>
        )}
        <p className="text-muted-foreground text-xs mb-4">Try again or give up?</p>
        <div className="space-y-2">
          <button
            onClick={onNewGame}
            className="block w-full px-4 py-2 bg-primary text-primary-foreground font-bold rounded hover:bg-primary/90 transition-colors text-sm"
          >
            TRY AGAIN
          </button>
          <button
            onClick={onBackToMenu}
            className="block w-full px-4 py-2 border border-destructive text-destructive font-bold rounded hover:bg-destructive/10 transition-colors text-sm"
          >
            GIVE UP
          </button>
          <button
            onClick={handleSaveScore}
            className="block w-full px-4 py-2 border-2 border-accent bg-accent/10 text-accent font-bold rounded hover:bg-accent/20 transition-colors text-sm"
          >
            🌐 SAVE TO GLOBAL LEADERBOARD
          </button>
          <button
            onClick={onTakeScreenshot}
            className="block w-full px-4 py-2 border border-accent text-accent-foreground font-bold rounded hover:bg-accent/10 transition-colors text-sm"
          >
            📸 SHARE SCORE CARD
          </button>
        </div>
      </div>
      
      {showNameDialog && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <PlayerNameDialog
            isOpen={showNameDialog}
            score={score}
            onSave={handleNameSave}
            onCancel={handleNameCancel}
          />
        </React.Suspense>
      )}

      {showShareCard && (
        <ShareScoreCard
          isOpen={showShareCard}
          playerName={savedPlayerName}
          score={score}
          gameMode={gameMode}
          speed={speed}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </>
  );
};

export default React.memo(GameOverlay);