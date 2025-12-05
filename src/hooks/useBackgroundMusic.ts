import { useEffect, useRef } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme, Theme } from '../contexts/ThemeContext';

export const useBackgroundMusic = (shouldPlay: boolean = false) => {
  const { settings } = useGameSettings();
  const { theme } = useTheme();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const getThemeConfig = (theme: Theme) => {
    switch (theme) {
      case 'ocean':
        return {
          notes: [
            // Ocean wave melody - calm, flowing
            261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
            493.88, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63, 246.94,
            261.63, 311.13, 349.23, 392.00, 440.00, 392.00, 349.23, 311.13,
          ],
          waveType: 'sine' as OscillatorType,
          tempo: 450,
          volume: 0.06,
        };
      case 'matrix':
        return {
          notes: [
            // Digital/glitchy electronic melody
            130.81, 164.81, 196.00, 130.81, 261.63, 196.00, 164.81, 130.81,
            155.56, 185.00, 220.00, 155.56, 311.13, 220.00, 185.00, 155.56,
            130.81, 196.00, 261.63, 311.13, 261.63, 196.00, 130.81, 98.00,
          ],
          waveType: 'sawtooth' as OscillatorType,
          tempo: 200,
          volume: 0.04,
        };
      case 'gameboy':
        return {
          notes: [
            // Classic 8-bit chiptune melody
            262, 294, 330, 349, 392, 392, 392, 349,
            330, 294, 262, 262, 294, 330, 294, 262,
            349, 330, 294, 330, 349, 392, 440, 392,
            349, 330, 294, 262, 294, 262, 247, 262,
          ],
          waveType: 'square' as OscillatorType,
          tempo: 280,
          volume: 0.05,
        };
      case 'pastel':
        return {
          notes: [
            // Soft, gentle melody
            392.00, 440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00,
            392.00, 349.23, 329.63, 349.23, 392.00, 440.00, 392.00, 349.23,
            329.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66,
          ],
          waveType: 'sine' as OscillatorType,
          tempo: 500,
          volume: 0.05,
        };
      case 'dark':
        return {
          notes: [
            // Mysterious dark melody
            130.81, 146.83, 164.81, 174.61, 196.00, 185.00, 164.81, 146.83,
            130.81, 123.47, 110.00, 123.47, 130.81, 146.83, 130.81, 110.00,
            98.00, 110.00, 130.81, 146.83, 164.81, 146.83, 130.81, 110.00,
          ],
          waveType: 'triangle' as OscillatorType,
          tempo: 400,
          volume: 0.05,
        };
      default: // light
        return {
          notes: [
            // Arabian Nights melody using Hijaz scale
            293.66, 311.13, 349.23, 369.99, 392.00, 415.30, 466.16, 440.00,
            415.30, 392.00, 369.99, 349.23, 311.13, 293.66, 277.18, 293.66,
            329.63, 369.99, 415.30, 466.16, 523.25, 466.16, 440.00, 415.30,
          ],
          waveType: 'square' as OscillatorType,
          tempo: 350,
          volume: 0.06,
        };
    }
  };

  const createMenuTune = () => {
    if (!settings.soundEnabled || !audioContextRef.current || isPlayingRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const config = getThemeConfig(theme);
    let noteIndex = 0;

    oscillator.type = config.waveType;
    oscillator.frequency.value = config.notes[0];
    gainNode.gain.value = config.volume;

    const playNote = () => {
      if (oscillator && gainNode && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        oscillator.frequency.setValueAtTime(config.notes[noteIndex], now);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(config.volume, now);
        gainNode.gain.exponentialRampToValueAtTime(config.volume * 1.5, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(config.volume * 0.3, now + 0.3);
        
        noteIndex = (noteIndex + 1) % config.notes.length;
      }
    };

    oscillator.start();
    isPlayingRef.current = true;
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    let intervalId: NodeJS.Timeout;
    
    const scheduleNextNote = () => {
      playNote();
      intervalId = setTimeout(scheduleNextNote, config.tempo);
    };
    
    scheduleNextNote();

    // Play for 12 seconds
    setTimeout(() => {
      clearTimeout(intervalId);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        isPlayingRef.current = false;
      }
    }, 12000);
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
      const timer = setTimeout(createMenuTune, 1000);
      return () => clearTimeout(timer);
    } else {
      stopTune();
    }
  }, [shouldPlay, settings.soundEnabled, theme]);

  return { createMenuTune, stopTune };
};
