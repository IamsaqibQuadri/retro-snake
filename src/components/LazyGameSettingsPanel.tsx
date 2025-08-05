import React from 'react';

// Lazy load GameSettingsPanel for better performance
const GameSettingsPanel = React.lazy(() => import('./GameSettingsPanel'));

interface LazyGameSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const LazyGameSettingsPanel = ({ isOpen, onClose }: LazyGameSettingsPanelProps) => {
  if (!isOpen) return null;

  return (
    <React.Suspense fallback={
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
          <div className="text-center text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    }>
      <GameSettingsPanel isOpen={isOpen} onClose={onClose} />
    </React.Suspense>
  );
};

export default LazyGameSettingsPanel;