
import { useEffect, useRef } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';

export const useBackgroundMusic = (shouldPlay: boolean = false) => {
  const { settings } = useGameSettings();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const createMenuTune = () => {
    if (!settings.soundEnabled || !audioContextRef.current || isPlayingRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Aladdin Arabian Nights inspired melody (desert theme)
    const notes = [
      440.00, 523.25, 587.33, 659.25, // A4, C5, D5, E5 - exotic opening
      587.33, 523.25, 493.88, 523.25, // D5, C5, B4, C5 - Arabian scale
      659.25, 698.46, 783.99, 698.46, // E5, F5, G5, F5 - mystical climb
      659.25, 587.33, 523.25, 440.00  // E5, D5, C5, A4 - desert wind finish
    ];
    let noteIndex = 0;

    oscillator.type = 'square'; // 8-bit style square wave
    oscillator.frequency.value = notes[0];
    gainNode.gain.value = 0.15; // Slightly louder for more energy

    const playNote = () => {
      if (oscillator && gainNode && audioContextRef.current) {
        // Add quick attack and decay for punchier sound
        const now = audioContextRef.current.currentTime;
        oscillator.frequency.setValueAtTime(notes[noteIndex], now);
        
        // Quick volume envelope for each note
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.05, now + 0.1);
        
        noteIndex = (noteIndex + 1) % notes.length;
      }
    };

    oscillator.start();
    isPlayingRef.current = true;
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Medium tempo for pleasant listening
    const interval = setInterval(playNote, 500);

    // Play for 8 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        isPlayingRef.current = false;
      }
    }, 8000);
  };

  const stopTune = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      isPlayingRef.current = false;
    }
  };

  useEffect(() => {
    if (shouldPlay && settings.soundEnabled) {
      // Small delay to prevent immediate playback
      const timer = setTimeout(createMenuTune, 1000);
      return () => clearTimeout(timer);
    } else {
      stopTune();
    }
  }, [shouldPlay, settings.soundEnabled]);

  return { createMenuTune, stopTune };
};
