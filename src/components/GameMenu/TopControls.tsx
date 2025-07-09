import React, { useState } from 'react';
import { Settings, Speaker, Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import ThemeSelector from '../ThemeSelector';
import SnakeSkinSelector from '../SnakeSkinSelector';
import SnakeColorSelector from '../SnakeColorSelector';

interface TopControlsProps {
  onShowSettings: () => void;
}

const TopControls = ({ onShowSettings }: TopControlsProps) => {
  const { theme } = useTheme();
  const { settings, toggleSound } = useGameSettings();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSnakeSkinSelector, setShowSnakeSkinSelector] = useState(false);
  const [showSnakeColorSelector, setShowSnakeColorSelector] = useState(false);

  // Using design system tokens for consistent theming
  const buttonClasses = "p-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-muted transition-all duration-200";

  return (
    <>
      {/* Top-left settings button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onShowSettings}
          className={buttonClasses}
          title="Game Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg border transition-all duration-200 ${
            settings.soundEnabled 
              ? 'border-border bg-card text-card-foreground hover:bg-muted'
              : 'border-muted bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
          title={settings.soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          <Speaker size={20} />
        </button>
        
        <button
          onClick={() => setShowThemeSelector(true)}
          className={buttonClasses}
          title="Change theme"
        >
          🎨
        </button>
        
        <button
          onClick={() => setShowSnakeSkinSelector(true)}
          className={buttonClasses}
          title="Change snake skin"
        >
          🐍
        </button>
        
        <button
          onClick={() => setShowSnakeColorSelector(true)}
          className={buttonClasses}
          title="Change snake color"
        >
          🎨
        </button>
      </div>
      
      <ThemeSelector 
        isOpen={showThemeSelector} 
        onClose={() => setShowThemeSelector(false)} 
      />
      
      <SnakeSkinSelector 
        isOpen={showSnakeSkinSelector} 
        onClose={() => setShowSnakeSkinSelector(false)} 
      />
      
      <SnakeColorSelector 
        isOpen={showSnakeColorSelector} 
        onClose={() => setShowSnakeColorSelector(false)} 
      />
    </>
  );
};

export default TopControls;