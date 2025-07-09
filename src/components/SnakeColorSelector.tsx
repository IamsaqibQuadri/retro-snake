import React from 'react';
import { X } from 'lucide-react';
import { useGameSettings } from '../contexts/GameSettingsContext';

interface SnakeColorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const snakeColors = [
  { name: 'Green', head: '#22c55e', body: '#16a34a' },
  { name: 'Blue', head: '#3b82f6', body: '#1d4ed8' },
  { name: 'Red', head: '#ef4444', body: '#dc2626' },
  { name: 'Purple', head: '#a855f7', body: '#7c3aed' },
  { name: 'Orange', head: '#f97316', body: '#ea580c' },
  { name: 'Yellow', head: '#eab308', body: '#ca8a04' },
  { name: 'Pink', head: '#ec4899', body: '#db2777' },
  { name: 'Cyan', head: '#06b6d4', body: '#0891b2' },
];

const SnakeColorSelector = ({ isOpen, onClose }: SnakeColorSelectorProps) => {
  const { settings, setSnakeColors } = useGameSettings();

  if (!isOpen) return null;

  const handleColorSelect = (headColor: string, bodyColor: string) => {
    setSnakeColors(headColor, bodyColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">🐍 Choose Snake Color</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {snakeColors.map((colorOption) => (
            <button
              key={colorOption.name}
              onClick={() => handleColorSelect(colorOption.head, colorOption.body)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                settings.snakeColor === colorOption.head
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: colorOption.head }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: colorOption.body }}
                />
              </div>
              <div className="font-semibold text-foreground">{colorOption.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnakeColorSelector;