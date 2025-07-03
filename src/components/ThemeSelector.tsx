import React from 'react';
import { X } from 'lucide-react';
import { Theme, useTheme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const themes: { value: Theme; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Clean and bright' },
  { value: 'dark', label: 'Dark', description: 'Classic dark mode' },
  { value: 'pastel', label: 'Pastel', description: 'Soft mint & peach colors' },
  { value: 'matrix', label: 'Matrix', description: 'Green digital vibes' },
  { value: 'retro', label: 'GameBoy', description: 'Retro green nostalgia' },
  { value: 'ghibli', label: 'Ghibli', description: 'Magical forest colors' },
];

const ThemeSelector = ({ isOpen, onClose }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">🎨 Choose Theme</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => handleThemeSelect(themeOption.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                theme === themeOption.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="font-semibold text-foreground">{themeOption.label}</div>
              <div className="text-xs text-muted-foreground">{themeOption.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;