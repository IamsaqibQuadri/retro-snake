import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Palette, Zap, Paintbrush } from 'lucide-react';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useSnakeSkin } from '../../contexts/SnakeSkinContext';
import ThemeSelector from '../ThemeSelector';
import SnakeSkinSelector from '../SnakeSkinSelector';
import SnakeColorSelector from '../SnakeColorSelector';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { settings, toggleSound } = useGameSettings();
  const { theme } = useTheme();
  const { snakeSkin } = useSnakeSkin();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSnakeSkinSelector, setShowSnakeSkinSelector] = useState(false);
  const [showSnakeColorSelector, setShowSnakeColorSelector] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h2 className="text-xl font-bold text-foreground">⚙️ Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 size={20} className="text-primary" />
              ) : (
                <VolumeX size={20} className="text-muted-foreground" />
              )}
              <span className="text-foreground font-medium">Sound Effects</span>
            </div>
            <button
              onClick={toggleSound}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                settings.soundEnabled
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Palette size={20} className="text-primary" />
              <div>
                <span className="text-foreground font-medium">Theme</span>
                <p className="text-xs text-muted-foreground">Current: {theme}</p>
              </div>
            </div>
            <button
              onClick={() => setShowThemeSelector(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              CHANGE
            </button>
          </div>

          {/* Snake Skin Selector */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-primary" />
              <div>
                <span className="text-foreground font-medium">Snake Skin</span>
                <p className="text-xs text-muted-foreground">Current: {snakeSkin}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSnakeSkinSelector(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              CHANGE
            </button>
          </div>

          {/* Snake Color Selector */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Paintbrush size={20} className="text-primary" />
              <div>
                <span className="text-foreground font-medium">Snake Color</span>
                <p className="text-xs text-muted-foreground">Customize your snake</p>
              </div>
            </div>
            <button
              onClick={() => setShowSnakeColorSelector(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              CHANGE
            </button>
          </div>
        </div>
      </div>

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      {/* Snake Skin Selector Modal */}
      <SnakeSkinSelector
        isOpen={showSnakeSkinSelector}
        onClose={() => setShowSnakeSkinSelector(false)}
      />

      {/* Snake Color Selector Modal */}
      <SnakeColorSelector
        isOpen={showSnakeColorSelector}
        onClose={() => setShowSnakeColorSelector(false)}
      />
    </>
  );
};

export default SettingsScreen;