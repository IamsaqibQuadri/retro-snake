
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

    // Authentic Arabian Nights melody using Hijaz scale (Middle Eastern mode)
    // Starting from D4 as root note, creating an exotic mystical atmosphere
    const notes = [
      // Opening mystical phrase - rising like desert wind
      293.66, 311.13, 349.23, 369.99, // D4, Eb4, F4, F#4
      392.00, 415.30, 466.16, 440.00, // G4, Ab4, Bb4, A4 (characteristic Hijaz intervals)
      
      // Mysterious descent - like shadows in moonlight  
      415.30, 392.00, 369.99, 349.23, // Ab4, G4, F#4, F4
      311.13, 293.66, 277.18, 293.66, // Eb4, D4, Db4, D4
      
      // Ornamental climb - Arabian flourish
      329.63, 369.99, 415.30, 466.16, // E4, F#4, Ab4, Bb4
      523.25, 466.16, 440.00, 415.30, // C5, Bb4, A4, Ab4
      
      // Exotic bridge - quarter-tone feeling simulation
      392.00, 405.00, 415.30, 440.00, // G4, slight bend, Ab4, A4
      466.16, 440.00, 415.30, 392.00, // Bb4, A4, Ab4, G4
      
      // Grand finale - soaring like a magic carpet
      523.25, 554.37, 587.33, 622.25, // C5, Db5, D5, Eb5
      659.25, 622.25, 587.33, 554.37, // E5, Eb5, D5, Db5
      523.25, 466.16, 415.30, 369.99, // C5, Bb4, Ab4, F#4
      349.23, 311.13, 293.66, 293.66  // F4, Eb4, D4, D4 (return home)
    ];
    
    let noteIndex = 0;
    let beatCount = 0;

    oscillator.type = 'square'; // Classic 8-bit style
    oscillator.frequency.value = notes[0];
    gainNode.gain.value = 0.08; // Softer, more mystical volume

    const playNote = () => {
      if (oscillator && gainNode && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        oscillator.frequency.setValueAtTime(notes[noteIndex], now);
        
        // Dynamic volume envelope for authentic Arabian feel
        // Some notes held longer, others quick and ornamental
        const noteDuration = [0.8, 0.4, 0.6, 0.4, 0.8, 0.6, 0.4, 0.8][beatCount % 8];
        
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.12, now + noteDuration * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.02, now + noteDuration * 0.9);
        
        noteIndex = (noteIndex + 1) % notes.length;
        beatCount++;
      }
    };

    oscillator.start();
    isPlayingRef.current = true;
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Arabian rhythm - slightly irregular timing like traditional Middle Eastern music
    let currentInterval = 350; // Base tempo
    let intervalId: NodeJS.Timeout;
    
    const scheduleNextNote = () => {
      playNote();
      
      // Vary the timing slightly for more organic Arabian feel
      const rhythmVariations = [320, 380, 340, 360, 330, 370, 350, 340];
      currentInterval = rhythmVariations[beatCount % rhythmVariations.length];
      
      intervalId = setTimeout(scheduleNextNote, currentInterval);
    };
    
    scheduleNextNote();

    // Play for 12 seconds (longer Arabian experience)
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
      // Small delay to prevent immediate playback
      const timer = setTimeout(createMenuTune, 1000);
      return () => clearTimeout(timer);
    } else {
      stopTune();
    }
  }, [shouldPlay, settings.soundEnabled]);

  return { createMenuTune, stopTune };
};
