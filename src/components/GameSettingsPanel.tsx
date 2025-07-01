
import React from 'react';
import { Volume2, VolumeX, Palette, X } from 'lucide-react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme } from '../contexts/ThemeContext';

interface GameSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameSettingsPanel = ({ isOpen, onClose }: GameSettingsPanelProps) => {
  const { settings, toggleSound, setSnakeColors } = useGameSettings();
  const { theme } = useTheme();

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`${themeColors.background} border-2 ${themeColors.border} rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${themeColors.primary} flex items-center gap-2`}>
            <Palette size={20} />
            Game Settings
          </h2>
          <button
            onClick={onClose}
            className={`${themeColors.primary} ${themeColors.hover} transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sound Settings */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold ${themeColors.primary} mb-3 flex items-center gap-2`}>
            {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            Sound
          </h3>
          <button
            onClick={toggleSound}
            className={`flex items-center gap-3 w-full p-3 border-2 rounded-lg transition-colors ${
              settings.soundEnabled
                ? `${themeColors.border} ${themeColors.panelBg} ${themeColors.primary}`
                : `border-gray-600 bg-gray-600/10 text-gray-400`
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{settings.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>
        </div>

        {/* Snake Colors */}
        <div>
          <h3 className={`text-lg font-semibold ${themeColors.primary} mb-3 flex items-center gap-2`}>
            <Palette size={18} />
            Snake Colors
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSnakeColors(preset.head, preset.body)}
                className={`p-3 border-2 rounded-lg transition-colors text-left ${
                  settings.snakeColor === preset.head
                    ? `${themeColors.border} ${themeColors.panelBg}`
                    : `border-gray-600 hover:border-green-400/50`
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: preset.head }}
                  />
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: preset.body }}
                  />
                </div>
                <span className={`text-sm ${themeColors.secondary}`}>{preset.name}</span>
              </button>
            ))}
          </div>
          
          {/* Current Selection Indicator */}
          <div className={`mt-4 p-3 border ${themeColors.border.replace('border-', 'border-').replace('-600', '-600/30').replace('-400', '-400/30')} ${themeColors.panelBg.replace('bg-', 'bg-').replace('/10', '/5')} rounded-lg`}>
            <div className={`text-xs ${themeColors.secondary} mb-2`}>Current Snake Colors:</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded border ${themeColors.border.replace('border-', 'border-').replace('-600', '-600/30').replace('-400', '-400/30')}`}
                  style={{ backgroundColor: settings.snakeColor }}
                />
                <span className={`text-xs ${themeColors.primary}`}>Head</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded border ${themeColors.border.replace('border-', 'border-').replace('-600', '-600/30').replace('-400', '-400/30')}`}
                  style={{ backgroundColor: settings.snakeBodyColor }}
                />
                <span className={`text-xs ${themeColors.primary}`}>Body</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsPanel;
