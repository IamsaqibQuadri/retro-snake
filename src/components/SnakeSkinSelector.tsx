import React from 'react';
import { X } from 'lucide-react';
import { SnakeSkin, useSnakeSkin } from '../contexts/SnakeSkinContext';

interface SnakeSkinSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const snakeSkins: { value: SnakeSkin; label: string; description: string; emoji: string }[] = [
  { value: 'remix', label: 'Remix', description: 'Modern gradient', emoji: '​🎨' },
  { value: 'classic', label: 'Dice', description: 'Dice numbers', emoji: '🎲' },
  { value: 'tetris', label: 'Tetris', description: 'Block style', emoji: '🧱' },
  { value: 'neon', label: 'Neon', description: 'Glowing outline', emoji: '💡' },
  { value: 'rainbow', label: 'Rainbow', description: 'Color cycling', emoji: '🌈' },
  { value: 'fire', label: 'Fire', description: 'Flame effect', emoji: '🔥' },
  { value: 'ice', label: 'Ice', description: 'Frozen frost', emoji: '❄️' },
  { value: 'wind', label: 'Wind', description: 'Smoky flow', emoji: '💨' },
];

const SnakeSkinSelector = ({ isOpen, onClose }: SnakeSkinSelectorProps) => {
  const { snakeSkin, setSnakeSkin } = useSnakeSkin();

  if (!isOpen) return null;

  const handleSkinSelect = (newSkin: SnakeSkin) => {
    setSnakeSkin(newSkin);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">🐍 Choose Snake Skin</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {snakeSkins.map((skinOption) => (
            <button
              key={skinOption.value}
              onClick={() => handleSkinSelect(skinOption.value)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                snakeSkin === skinOption.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="text-xl mb-1">{skinOption.emoji}</div>
              <div className="font-semibold text-foreground text-sm">{skinOption.label}</div>
              <div className="text-xs text-muted-foreground">{skinOption.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnakeSkinSelector;