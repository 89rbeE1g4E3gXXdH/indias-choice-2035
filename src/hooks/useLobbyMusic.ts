import { useCallback, useRef, useEffect } from 'react';

export const useLobbyMusic = (isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
    try {
      const ctx = getAudioContext();
      
      // Create master gain for volume control
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // Ambient pad notes (C major pentatonic - calming)
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let noteIndex = 0;

      const playNote = () => {
        if (!isPlaying) return;
        
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(masterGain);
        
        // Randomly pick a note from the scale
        const freq = notes[noteIndex % notes.length];
        noteIndex++;
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        // Soft fade in and out
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
        noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.5);
        
        oscillatorsRef.current.push(osc);
        
        // Clean up old oscillators
        setTimeout(() => {
          oscillatorsRef.current = oscillatorsRef.current.filter(o => o !== osc);
        }, 3000);
      };

      // Play initial note
      playNote();
      
      // Play notes every 1.5 seconds for ambient feel
      intervalRef.current = window.setInterval(playNote, 1500);
      
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startMusic();
    } else {
      stopMusic();
    }
    
    return () => {
      stopMusic();
    };
  }, [isPlaying, startMusic, stopMusic]);

  return { stopMusic };
};
