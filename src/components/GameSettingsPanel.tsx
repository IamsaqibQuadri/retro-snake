
import React, { useState } from 'react';
import { Volume2, VolumeX, Palette, X, Shirt } from 'lucide-react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';
import SnakeSkinSelector from './SnakeSkinSelector';

interface GameSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameSettingsPanel = ({ isOpen, onClose }: GameSettingsPanelProps) => {
  const { settings, toggleSound, setSnakeColors } = useGameSettings();
  const { theme } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSnakeSkinSelector, setShowSnakeSkinSelector] = useState(false);

  // Theme-based colors
  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    secondary: theme === 'light' ? 'text-gray-600' : 'text-green-300',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-white' : 'bg-black',
    panelBg: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  const colorPresets = [
    { name: 'Classic Green', head: '#22c55e', body: '#16a34a' },
    { name: 'Blue Ocean', head: '#3b82f6', body: '#1d4ed8' },
    { name: 'Purple Magic', head: '#a855f7', body: '#7c3aed' },
    { name: 'Red Fire', head: '#ef4444', body: '#dc2626' },
    { name: 'Orange Sunset', head: '#f97316', body: '#ea580c' },
    { name: 'Pink Rose', head: '#ec4899', body: '#db2777' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">⚙️ Game Settings</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={toggleSound}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors w-full text-left"
            >
              {settings.soundEnabled ? <Volume2 size={20} className="text-primary" /> : <VolumeX size={20} className="text-muted-foreground" />}
              <div>
                <div className="font-semibold text-foreground">Sound</div>
                <div className="text-xs text-muted-foreground">{settings.soundEnabled ? 'Sound enabled' : 'Sound disabled'}</div>
              </div>
            </button>

            <button
              onClick={() => setShowThemeSelector(true)}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors w-full text-left"
            >
              <Palette size={20} className="text-primary" />
              <div>
                <div className="font-semibold text-foreground">Theme</div>
                <div className="text-xs text-muted-foreground">Change app appearance</div>
              </div>
            </button>

            <button
              onClick={() => setShowSnakeSkinSelector(true)}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors w-full text-left"
            >
              <Shirt size={20} className="text-primary" />
              <div>
                <div className="font-semibold text-foreground">Snake Skin</div>
                <div className="text-xs text-muted-foreground">Choose snake appearance</div>
              </div>
            </button>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Snake Colors</h4>
              <div className="grid grid-cols-3 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSnakeColors(preset.head, preset.body)}
                    className={`p-2 rounded border transition-colors ${
                      settings.snakeColor === preset.head
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    title={preset.name}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: preset.head }}
                      />
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: preset.body }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThemeSelector 
        isOpen={showThemeSelector} 
        onClose={() => setShowThemeSelector(false)} 
      />
      
      <SnakeSkinSelector 
        isOpen={showSnakeSkinSelector} 
        onClose={() => setShowSnakeSkinSelector(false)} 
      />
    </>
  );
};

export default GameSettingsPanel;
