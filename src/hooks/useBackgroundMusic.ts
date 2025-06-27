
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

    // Simple melody notes (C-E-G-C pattern)
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    let noteIndex = 0;

    oscillator.type = 'sine';
    oscillator.frequency.value = notes[0];
    gainNode.gain.value = 0.1; // Very quiet background tune

    const playNote = () => {
      if (oscillator && gainNode) {
        oscillator.frequency.setValueAtTime(notes[noteIndex], context.currentTime);
        noteIndex = (noteIndex + 1) % notes.length;
      }
    };

    oscillator.start();
    isPlayingRef.current = true;
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Play melody pattern
    const interval = setInterval(playNote, 800);

    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        isPlayingRef.current = false;
      }
    }, 10000);
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
