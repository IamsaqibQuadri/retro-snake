
import { useEffect, useRef } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme } from '../contexts/ThemeContext';

export const useGameSounds = () => {
  const { settings } = useGameSettings();
  const { theme } = useTheme();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API context
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const createBeep = (frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'square') => {
    if (!settings.soundEnabled || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  };

  // Create bubbly sound for ocean theme
  const createBubbleSound = (isEat: boolean) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.type = 'sine';
    const baseFreq = isEat ? 600 : 150;
    
    // Bubbly pitch rise
    oscillator.frequency.setValueAtTime(baseFreq, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, context.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + (isEat ? 0.15 : 0.4));
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + (isEat ? 0.15 : 0.4));
  };

  // Create digital glitchy sound for matrix theme
  const createMatrixSound = (isEat: boolean) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const context = audioContextRef.current;
    
    // Create multiple oscillators for glitchy effect
    for (let i = 0; i < (isEat ? 3 : 5); i++) {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'sawtooth';
      const freq = isEat ? 800 + Math.random() * 400 : 100 + Math.random() * 100;
      
      oscillator.frequency.setValueAtTime(freq, context.currentTime + i * 0.02);
      
      gainNode.gain.setValueAtTime(0.15, context.currentTime + i * 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + i * 0.02 + 0.05);
      
      oscillator.start(context.currentTime + i * 0.02);
      oscillator.stop(context.currentTime + i * 0.02 + 0.05);
    }
  };

  // Create 8-bit gameboy sounds
  const createGameboySound = (isEat: boolean) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.type = 'square';
    
    if (isEat) {
      // Classic 8-bit pickup sound
      oscillator.frequency.setValueAtTime(523, context.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, context.currentTime + 0.05); // E5
      oscillator.frequency.setValueAtTime(784, context.currentTime + 0.1); // G5
      gainNode.gain.setValueAtTime(0.25, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.15);
    } else {
      // Game over descending tone
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, context.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    }
  };

  // Create soft pastel sounds
  const createPastelSound = (isEat: boolean) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = isEat ? 880 : 220;
    
    gainNode.gain.setValueAtTime(0.2, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + (isEat ? 0.2 : 0.6));
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + (isEat ? 0.2 : 0.6));
  };

  const playEatSound = () => {
    switch (theme) {
      case 'ocean':
        createBubbleSound(true);
        break;
      case 'matrix':
        createMatrixSound(true);
        break;
      case 'gameboy':
        createGameboySound(true);
        break;
      case 'pastel':
        createPastelSound(true);
        break;
      default:
        createBeep(800, 0.1, 0.4);
    }
  };

  const playGameOverSound = () => {
    switch (theme) {
      case 'ocean':
        createBubbleSound(false);
        break;
      case 'matrix':
        createMatrixSound(false);
        break;
      case 'gameboy':
        createGameboySound(false);
        break;
      case 'pastel':
        createPastelSound(false);
        break;
      default:
        createBeep(200, 0.5, 0.6);
    }
  };

  const playMoveSound = () => {
    // Very quiet, short beep for movement (optional)
    createBeep(400, 0.05, 0.1);
  };

  return {
    playEatSound,
    playGameOverSound,
    playMoveSound,
  };
};
