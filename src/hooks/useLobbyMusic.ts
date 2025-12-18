import { useCallback, useRef, useEffect } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';

export const useLobbyMusic = (isPlaying: boolean) => {
  const { isMuted } = useAudioContext();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const stopMusic = useCallback(() => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current?.currentTime || 0);
    }
  }, []);

  const startMusic = useCallback(() => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      
      // Create master gain
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // Minecraft-style calm piano melody (C major, peaceful intervals)
      // Similar to "Sweden" or "Wet Hands"
      const melodySequence = [
        { note: 523.25, delay: 0 },      // C5
        { note: 659.25, delay: 800 },    // E5
        { note: 783.99, delay: 1600 },   // G5
        { note: 659.25, delay: 2400 },   // E5
        { note: 523.25, delay: 3200 },   // C5
        { note: 392.00, delay: 4000 },   // G4
        { note: 440.00, delay: 4800 },   // A4
        { note: 523.25, delay: 5600 },   // C5
        { note: 659.25, delay: 6400 },   // E5
        { note: 587.33, delay: 7200 },   // D5
        { note: 523.25, delay: 8000 },   // C5
        { note: 392.00, delay: 8800 },   // G4
        { note: 329.63, delay: 9600 },   // E4
        { note: 392.00, delay: 10400 },  // G4
        { note: 440.00, delay: 11200 },  // A4
        { note: 523.25, delay: 12000 },  // C5
      ];

      const playNote = (freq: number, duration: number = 1.8) => {
        if (isMuted) return;
        
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        // Add reverb-like effect with another oscillator
        const osc2 = ctx.createOscillator();
        const noteGain2 = ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(masterGain);
        
        osc2.connect(noteGain2);
        noteGain2.connect(masterGain);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        // Soft octave harmony
        osc2.frequency.value = freq * 0.5;
        osc2.type = 'sine';
        
        // Gentle piano-like envelope
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        noteGain2.gain.setValueAtTime(0, ctx.currentTime);
        noteGain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
        noteGain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 1.2);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
        
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + duration * 1.2);
        
        oscillatorsRef.current.push(osc, osc2);
        
        const cleanupTimeout = window.setTimeout(() => {
          oscillatorsRef.current = oscillatorsRef.current.filter(o => o !== osc && o !== osc2);
        }, duration * 1200 + 100);
        timeoutRefs.current.push(cleanupTimeout);
      };

      // Play melody sequence
      const playSequence = () => {
        melodySequence.forEach(({ note, delay }) => {
          const t = window.setTimeout(() => {
            if (!isMuted && isPlaying) {
              playNote(note);
            }
          }, delay);
          timeoutRefs.current.push(t);
        });
        
        // Loop the sequence
        const loopTimeout = window.setTimeout(() => {
          if (isPlaying && !isMuted) {
            playSequence();
          }
        }, 13000);
        timeoutRefs.current.push(loopTimeout);
      };

      playSequence();
      
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext, isMuted, isPlaying]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      startMusic();
    } else {
      stopMusic();
    }
    
    return () => {
      stopMusic();
    };
  }, [isPlaying, isMuted, startMusic, stopMusic]);

  return { stopMusic };
};
