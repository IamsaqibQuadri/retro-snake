import React, { useState } from 'react';
import { X, Palette, Gamepad2, Settings } from 'lucide-react';
import { useTheme, Theme } from '../contexts/ThemeContext';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { SnakeSkin, useSnakeSkin } from '../contexts/SnakeSkinContext';

interface UnifiedSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const themes: { value: Theme; label: string; description: string; preview: string }[] = [
  { value: 'light', label: 'Light', description: 'Clean and bright', preview: '☀️' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes', preview: '🌙' },
  { value: 'pastel', label: 'Pastel Dreams', description: 'Soft and dreamy colors', preview: '🌸' },
  { value: 'gameboy', label: 'Game Boy Retro', description: 'Classic LCD green', preview: '🎮' },
];

const snakeSkins: { value: SnakeSkin; label: string; description: string; preview: string }[] = [
  { value: 'remix', label: 'Remix', description: 'Modern gradient design', preview: '🌈' },
  { value: 'classic', label: 'Dice', description: 'Pixelated with dice numbers', preview: '🎲' },
  { value: 'tetris', label: 'Tetris', description: 'Block-style Tetris theme', preview: '🧱' },
];

const snakeColors = [
  { name: 'Green', head: '#22c55e', body: '#16a34a', preview: '🟢' },
  { name: 'Blue', head: '#3b82f6', body: '#1d4ed8', preview: '🔵' },
  { name: 'Red', head: '#ef4444', body: '#dc2626', preview: '🔴' },
  { name: 'Purple', head: '#a855f7', body: '#7c3aed', preview: '🟣' },
  { name: 'Orange', head: '#f97316', body: '#ea580c', preview: '🟠' },
  { name: 'Yellow', head: '#eab308', body: '#ca8a04', preview: '🟡' },
  { name: 'Pink', head: '#ec4899', body: '#db2777', preview: '🩷' },
  { name: 'Cyan', head: '#06b6d4', body: '#0891b2', preview: '🔷' },
];

const UnifiedSettingsPanel = ({ isOpen, onClose }: UnifiedSettingsPanelProps) => {
  const { theme, setTheme } = useTheme();
  const { settings, setSnakeColors } = useGameSettings();
  const { snakeSkin, setSnakeSkin } = useSnakeSkin();
  const [activeTab, setActiveTab] = useState<'themes' | 'skins' | 'colors'>('themes');

  if (!isOpen) return null;

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSkinSelect = (newSkin: SnakeSkin) => {
    setSnakeSkin(newSkin);
  };

  const handleColorSelect = (headColor: string, bodyColor: string) => {
    setSnakeColors(headColor, bodyColor);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Customization Panel
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'themes'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            🎨 Themes
          </button>
          <button
            onClick={() => setActiveTab('skins')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'skins'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            🐍 Snake Skins
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'colors'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            🎨 Snake Colors
          </button>
        </div>

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-4">Choose Your Theme</h3>
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => handleThemeSelect(themeOption.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  theme === themeOption.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground bg-card hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{themeOption.preview}</span>
                  <div>
                    <div className="font-medium text-foreground">{themeOption.label}</div>
                    <div className="text-sm text-muted-foreground">{themeOption.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Snake Skins Tab */}
        {activeTab === 'skins' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-4">Choose Snake Skin</h3>
            {snakeSkins.map((skinOption) => (
              <button
                key={skinOption.value}
                onClick={() => handleSkinSelect(skinOption.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  snakeSkin === skinOption.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground bg-card hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skinOption.preview}</span>
                  <div>
                    <div className="font-medium text-foreground">{skinOption.label}</div>
                    <div className="text-sm text-muted-foreground">{skinOption.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Snake Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-4">Choose Snake Color</h3>
            <div className="grid grid-cols-2 gap-3">
              {snakeColors.map((color) => {
                const isSelected = settings.snakeColor === color.head;
                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.head, color.body)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground bg-card hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{color.preview}</span>
                      <div>
                        <div className="font-medium text-foreground">{color.name}</div>
                        <div className="flex gap-1 mt-1">
                          <div 
                            className="w-4 h-4 rounded border border-border"
                            style={{ backgroundColor: color.head }}
                          />
                          <div 
                            className="w-4 h-4 rounded border border-border"
                            style={{ backgroundColor: color.body }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedSettingsPanel;