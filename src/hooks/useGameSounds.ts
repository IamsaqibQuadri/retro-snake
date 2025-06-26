
import { useEffect, useRef } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';

export const useGameSounds = () => {
  const { settings } = useGameSettings();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API context
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  };

  const playEatSound = () => {
    // Higher pitched beep for eating food
    createBeep(800, 0.1, 0.4);
  };

  const playGameOverSound = () => {
    // Lower pitched longer beep for game over
    createBeep(200, 0.5, 0.6);
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
