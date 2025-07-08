
import React from 'react';
import { X } from 'lucide-react';
import SettingsScreen from './GameMenu/SettingsScreen';

interface GameSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameSettingsPanel = ({ isOpen, onClose }: GameSettingsPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded absolute top-4 right-4"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        <SettingsScreen onBack={onClose} />
      </div>
    </div>
  );
};

export default GameSettingsPanel;
