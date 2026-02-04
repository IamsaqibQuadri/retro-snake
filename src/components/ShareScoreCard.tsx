import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';

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
    classic: '🏛️ CLASSIC',
    modern: '🌐 MODERN',
    timeattack: '⏱️ TIME ATTACK',
    survival: '💀 SURVIVAL',
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
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `rattlerush-score-${score}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
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
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">🎮 Share Your Score</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Score Card for Screenshot */}
        <div 
          ref={cardRef}
          className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${getThemeGradient()} ${getTextColor()} mb-4`}
          style={{ aspectRatio: '4/3' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            {/* Rattle Rush Logo */}
            <img 
              src={LOGO_PATH} 
              alt="Rattle Rush" 
              className="h-12 w-auto mb-2 drop-shadow-lg"
              crossOrigin="anonymous"
            />
            <div className="text-5xl font-black mb-3 drop-shadow-lg">{score}</div>
            <div className="text-sm opacity-80 mb-2">{playerName}</div>
            <div className="flex gap-2 text-xs opacity-70">
              <span className="px-2 py-1 bg-white/20 rounded-full">{gameModeLabels[gameMode]}</span>
              <span className="px-2 py-1 bg-white/20 rounded-full">{speedLabels[speed]}</span>
            </div>
            <div className="text-xs opacity-50 mt-4">rattlerush.lovable.app</div>
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
