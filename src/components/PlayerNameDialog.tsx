import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PlayerNameDialogProps {
  isOpen: boolean;
  score: number;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const PlayerNameDialog = ({ isOpen, score, onSave, onCancel }: PlayerNameDialogProps) => {
  const [playerName, setPlayerName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const name = playerName.trim() || 'Anonymous';
    onSave(name);
    setPlayerName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold text-foreground mb-2">🏆 Save Your Score!</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Great game! You scored {score} points. Enter your name to save to the global leaderboard:
        </p>
        
        <Input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your name..."
          className="mb-4"
          autoFocus
          maxLength={20}
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSave}
            className="flex-1"
          >
            Save Score
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerNameDialog;