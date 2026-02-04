import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';
import PlayerNameDialog from './PlayerNameDialog';
import ShareScoreCard from './ShareScoreCard';
import { useGlobalLeaderboard } from '../hooks/useGlobalLeaderboard';
import { toast } from '@/hooks/use-toast';

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
  const [isSaving, setIsSaving] = useState(false);
  
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
    setIsSaving(true);
    setSavedPlayerName(playerName);
    
    const result = await addScore(playerName, score, gameMode, speed);
    
    setIsSaving(false);
    
    if (result.success) {
      toast({
        title: "Score saved!",
        description: `Your score of ${score} has been saved to the global leaderboard.`,
      });
      setShowNameDialog(false);
      // Return to home screen after successful save
      onBackToMenu();
    } else {
      toast({
        title: "Failed to save score",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNameCancel = () => {
    setShowNameDialog(false);
  };

  const handleShareScore = () => {
    setShowShareCard(true);
  };

  return (
    <>
      <div className={`absolute inset-0 ${getOverlayBg()} flex flex-col items-center justify-center text-center p-4 z-50`}>
        <div className="max-w-xs w-full">
          <h2 className="text-2xl font-bold text-destructive mb-1">GAME OVER</h2>
          <p className="text-primary text-3xl font-bold mb-2">{score}</p>
          {score === highScore && score > 0 && (
            <p className="text-accent text-sm mb-4">🏆 NEW HIGH SCORE!</p>
          )}
          
          {/* Primary actions - 2 column grid */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={onNewGame}
              className="px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              🔄 RETRY
            </button>
            <button
              onClick={onBackToMenu}
              className="px-4 py-3 border border-muted-foreground text-foreground font-bold rounded-lg hover:bg-muted transition-colors text-sm"
            >
              🏠 HOME
            </button>
          </div>
          
          {/* Secondary actions - 2 column grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSaveScore}
              className="px-3 py-2 border border-accent bg-accent/10 text-accent font-medium rounded-lg hover:bg-accent/20 transition-colors text-xs"
            >
              🌐 SAVE
            </button>
            <button
              onClick={handleShareScore}
              className="px-3 py-2 border border-primary bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors text-xs"
            >
              📤 SHARE
            </button>
          </div>
        </div>
      </div>
      
      <PlayerNameDialog
        isOpen={showNameDialog}
        score={score}
        onSave={handleNameSave}
        onCancel={handleNameCancel}
        isLoading={isSaving}
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
