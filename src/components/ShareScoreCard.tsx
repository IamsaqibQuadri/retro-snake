import React, { useRef } from 'react';
import { Download, X, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface ShareScoreCardProps {
  isOpen: boolean;
  playerName: string;
  score: number;
  gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';
  speed: 'slow' | 'normal' | 'fast';
  onClose: () => void;
}

const ShareScoreCard = ({ isOpen, playerName, score, gameMode, speed, onClose }: ShareScoreCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const getModeEmoji = () => {
    switch (gameMode) {
      case 'classic': return '🏛️';
      case 'modern': return '🌐';
      case 'obstacles': return '🧱';
      case 'timeattack': return '⏱️';
      case 'survival': return '🔥';
      default: return '🎮';
    }
  };

  const getModeName = () => {
    switch (gameMode) {
      case 'classic': return 'Classic';
      case 'modern': return 'Modern';
      case 'obstacles': return 'Obstacles';
      case 'timeattack': return 'Time Attack';
      case 'survival': return 'Survival';
      default: return 'Game';
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `snake-score-${score}-${gameMode}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Score card downloaded!",
        description: "Share it with your friends!",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not save score card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    const text = `🐍 I scored ${score} points in Snake ${getModeName()} Mode (${speed} speed)! Can you beat my score?`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Share your achievement!",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Share Your Score!</h2>

        {/* Score Card Preview */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-primary/20 via-card to-secondary/20 border-4 border-primary rounded-2xl p-8 mb-6 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 text-6xl opacity-10">{getModeEmoji()}</div>
          <div className="absolute bottom-0 left-0 text-6xl opacity-10">🐍</div>

          <div className="relative z-10 text-center space-y-4">
            <div className="text-sm font-bold text-accent uppercase tracking-wide">
              {getModeName()} Mode
            </div>
            
            <div className="text-6xl font-bold text-primary animate-pulse">
              {score}
            </div>
            
            <div className="text-lg text-foreground font-semibold">
              {playerName || 'Anonymous Player'}
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-card/50 rounded-full border border-border">
                {getModeEmoji()} {getModeName()}
              </span>
              <span className="px-3 py-1 bg-card/50 rounded-full border border-border">
                🏃 {speed.toUpperCase()}
              </span>
            </div>

            <div className="text-xs text-muted-foreground pt-4 border-t border-border/30">
              🎮 Snake Game Challenge
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download size={20} />
            Download Image
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-accent bg-accent/10 text-accent font-bold rounded-lg hover:bg-accent/20 transition-colors"
          >
            <Share2 size={20} />
            Copy Share Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareScoreCard;
