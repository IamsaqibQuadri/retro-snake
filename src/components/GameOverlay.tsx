
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';
import PlayerNameDialog from './PlayerNameDialog';
import ShareScoreCard from './ShareScoreCard';
import { useGlobalLeaderboard } from '../hooks/useGlobalLeaderboard';

interface GameOverlayProps {
  gameOver: boolean;
  score: number;
  highScore: number;
  gameMode: GameMode;
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
  const [savedPlayerName, setSavedPlayerName] = useState('Player');
  
  if (!gameOver) return null;

  // Theme-aware overlay background with better visibility
  const getOverlayBg = () => {
    switch (theme) {
      case 'light': return 'bg-white/95 backdrop-blur-md';
      case 'dark': return 'bg-black/90 backdrop-blur-md';
      case 'pastel': return 'bg-white/95 backdrop-blur-md';
      case 'matrix': return 'bg-black/95 backdrop-blur-md';
      case 'ocean': return 'bg-blue-900/95 backdrop-blur-md';
      default: return 'bg-background/90 backdrop-blur-md';
    }
  };

  const handleSaveScore = () => {
    setShowNameDialog(true);
  };

  const handleNameSave = async (playerName: string) => {
    setSavedPlayerName(playerName);
    await addScore(playerName, score, gameMode, speed);
    setShowNameDialog(false);
  };

  const handleNameCancel = () => {
    setShowNameDialog(false);
  };

  const handleShareScore = () => {
    setShowShareCard(true);
  };

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
            onClick={handleShareScore}
            className="block w-full px-4 py-2 border border-accent text-accent-foreground font-bold rounded hover:bg-accent/10 transition-colors text-sm"
          >
            📤 SHARE SCORE
          </button>
        </div>
      </div>
      
      <PlayerNameDialog
        isOpen={showNameDialog}
        score={score}
        onSave={handleNameSave}
        onCancel={handleNameCancel}
      />
      
      <ShareScoreCard
        isOpen={showShareCard}
        onClose={() => setShowShareCard(false)}
        score={score}
        playerName={savedPlayerName}
        gameMode={gameMode}
        speed={speed}
      />
    </>
  );
};

export default GameOverlay;
