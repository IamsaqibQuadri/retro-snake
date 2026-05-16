import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';
import { logger } from '../utils/logger';

interface ShareScoreCardProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  playerName?: string;
  gameMode: GameMode;
  speed: 'slow' | 'normal' | 'fast';
}

const LOGO_PATH = '/lovable-uploads/fac2201e-f8a2-4cac-8ebc-c735a61174d1.png';

const ShareScoreCard = ({ isOpen, onClose, score, playerName = 'Player', gameMode, speed }: ShareScoreCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Preload logo
      const img = new Image();
      img.onload = () => setLogoLoaded(true);
      img.src = LOGO_PATH;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const gameModeLabels: Record<GameMode, string> = {
    chaos: '🌀 CHAOS',
    classic: 'CLASSIC',
    modern: ' MODERN',
    timeattack: ' TIME ATTACK',
    survival: ' SURVIVAL',
  };

  const speedLabels = {
    slow: '🐢 Slow',
    normal: '🏃 Normal',
    fast: '⚡ Fast',
  };

  const getThemeGradient = () => {
    switch (theme) {
      case 'dark': return 'from-gray-900 via-gray-800 to-gray-900';
      case 'pastel': return 'from-pink-200 via-purple-200 to-blue-200';
      case 'matrix': return 'from-black via-green-950 to-black';
      case 'ocean': return 'from-blue-900 via-cyan-800 to-blue-900';
      default: return 'from-green-600 via-emerald-500 to-green-600';
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case 'pastel': return 'text-gray-900';
      default: return 'text-white';
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !logoLoaded) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // Higher resolution for crisp output
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0, // Wait for images to fully load
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `rattlerush-score-${score}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // Max quality
      link.click();
    } catch (error) {
      logger.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    const gameUrl = window.location.origin;
    await navigator.clipboard.writeText(`I scored ${score} points in Rattle Rush! 🐍 Play now: ${gameUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rattle Rush Score',
          text: `I scored ${score} points in Rattle Rush! 🐍`,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled or share failed
        logger.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-4 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">🎮 Share Your Score</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Score Card for Screenshot - Fixed dimensions for consistent output */}
        <div 
          ref={cardRef}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getThemeGradient()} ${getTextColor()} mb-4`}
          style={{ 
            width: '400px', 
            height: '300px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          {/* Subtle radial glow instead of noisy pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
            }}
          />

          {/* Content - More spacing and larger elements */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 py-6">
            {/* Rattle Rush Logo - Larger */}
            <img 
              src={LOGO_PATH} 
              alt="Rattle Rush" 
              className="h-16 w-auto mb-4 drop-shadow-lg"
              crossOrigin="anonymous"
            />
            
            {/* Giant Score - Hero element */}
            <div className="text-5xl font-black mb-2 drop-shadow-lg tracking-tight">{score}</div>
            
            {/* Player name */}
            <div className="text-base opacity-80 mb-4 font-medium">by {playerName}</div>
            
            {/* Mode/Speed pills */}
            <div className="flex gap-3 text-xs opacity-80 mb-4">
              <span className="px-3 py-1.5 bg-white/20 rounded-full font-medium backdrop-blur-sm flex items-center justify-center">{gameModeLabels[gameMode]}</span>
              <span className="px-3 py-1.5 bg-white/20 rounded-full font-medium backdrop-blur-sm flex items-center justify-center">{speedLabels[speed]}</span>
            </div>
            
            {/* URL watermark */}
            <div className="text-xs opacity-50 font-medium">rattlerush.lovable.app</div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleDownload}
            disabled={isGenerating || !logoLoaded}
            className="flex flex-col items-center gap-1 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-xs disabled:opacity-50"
          >
            <Download size={18} />
            {isGenerating ? 'Saving...' : 'Download'}
          </button>
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-xs"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 p-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg transition-colors text-xs"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareScoreCard;
