import React from 'react';
import { Settings, Speaker, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useGameSettings } from '../../contexts/GameSettingsContext';

interface TopControlsProps {
  onShowSettings: () => void;
}

const TopControls = ({ onShowSettings }: TopControlsProps) => {
  const { theme, toggleTheme } = useTheme();
  const { settings, toggleSound } = useGameSettings();

  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  return (
    <>
      {/* Top-left settings button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onShowSettings}
          className={`p-2 rounded-lg border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200`}
          title="Game Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg border-2 transition-all duration-200 ${
            settings.soundEnabled 
              ? `${themeColors.border} ${themeColors.background} ${themeColors.primary}` 
              : `border-gray-600 bg-gray-600/10 text-gray-400`
          } ${themeColors.hover}`}
          title={settings.soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          <Speaker size={20} />
        </button>
        
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </>
  );
};

export default TopControls;