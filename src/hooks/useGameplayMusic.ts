import { useCallback, useRef, useEffect } from 'react';

export const useGameplayMusic = (isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const beatIntervalRef = useRef<number | null>(null);

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
    if (beatIntervalRef.current) {
      clearInterval(beatIntervalRef.current);
      beatIntervalRef.current = null;
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
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // Dramatic minor scale notes (A minor - tense/dramatic)
      const melodyNotes = [220, 261.63, 293.66, 329.63, 349.23, 392, 440];
      const bassNotes = [110, 130.81, 146.83, 164.81];
      let noteIndex = 0;

      // Play dramatic melody
      const playMelody = () => {
        if (!isPlaying) return;
        
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(masterGain);
        
        const freq = melodyNotes[noteIndex % melodyNotes.length];
        noteIndex++;
        
        osc.frequency.value = freq;
        osc.type = 'triangle';
        
        // Quick attack, moderate sustain
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
        noteGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
        noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
        
        oscillatorsRef.current.push(osc);
        setTimeout(() => {
          oscillatorsRef.current = oscillatorsRef.current.filter(o => o !== osc);
        }, 1000);
      };

      // Play driving bass beat
      let bassIndex = 0;
      const playBass = () => {
        if (!isPlaying) return;
        
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(masterGain);
        
        const freq = bassNotes[bassIndex % bassNotes.length];
        bassIndex++;
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        // Punchy bass
        noteGain.gain.setValueAtTime(0.5, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
        
        oscillatorsRef.current.push(osc);
        setTimeout(() => {
          oscillatorsRef.current = oscillatorsRef.current.filter(o => o !== osc);
        }, 400);
      };

      // Start immediately
      playMelody();
      playBass();
      
      // Melody every 800ms
      intervalRef.current = window.setInterval(playMelody, 800);
      
      // Bass beat every 500ms for driving rhythm
      beatIntervalRef.current = window.setInterval(playBass, 500);
      
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
