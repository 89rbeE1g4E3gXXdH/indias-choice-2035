import { useCallback, useRef } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.05);
  }, [playTone]);

  // Satisfying selection sound - longer and more impactful
  const playSelect = useCallback(() => {
    // Initial impact
    playTone(400, 0.15, 'sine', 0.12);
    playTone(600, 0.15, 'triangle', 0.1);
    // Rising sweep
    setTimeout(() => playTone(500, 0.2, 'sine', 0.12), 100);
    setTimeout(() => playTone(700, 0.2, 'sine', 0.12), 200);
    setTimeout(() => playTone(900, 0.25, 'sine', 0.14), 350);
    // Satisfying chime cascade
    setTimeout(() => playTone(1100, 0.3, 'sine', 0.12), 550);
    setTimeout(() => playTone(880, 0.25, 'sine', 0.1), 750);
    setTimeout(() => playTone(1100, 0.35, 'sine', 0.1), 950);
    // Final resonant tone
    setTimeout(() => playTone(660, 0.5, 'sine', 0.08), 1200);
    setTimeout(() => playTone(880, 0.6, 'triangle', 0.06), 1500);
    setTimeout(() => playTone(1320, 0.8, 'sine', 0.05), 2000);
    setTimeout(() => playTone(880, 0.7, 'sine', 0.04), 2500);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.08);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 100);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.08), 200);
  }, [playTone]);

  const playCountdown = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.06);
  }, [playTone]);

  // Urgent blaring alarm for very low time
  const playUrgentAlarm = useCallback(() => {
    playTone(880, 0.15, 'square', 0.15);
    setTimeout(() => playTone(660, 0.15, 'square', 0.15), 150);
    setTimeout(() => playTone(880, 0.15, 'square', 0.15), 300);
  }, [playTone]);

  const playExplosion = useCallback(() => {
    playTone(100, 0.3, 'sawtooth', 0.1);
    setTimeout(() => playTone(60, 0.2, 'square', 0.08), 50);
  }, [playTone]);

  const playStart = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.08);
    setTimeout(() => playTone(550, 0.1, 'sine', 0.08), 80);
    setTimeout(() => playTone(660, 0.15, 'sine', 0.1), 160);
  }, [playTone]);

  // Celebratory fanfare for high scores
  const playCelebration = useCallback(() => {
    playTone(523, 0.12, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 100);
    setTimeout(() => playTone(784, 0.12, 'sine', 0.12), 200);
    setTimeout(() => playTone(1047, 0.25, 'sine', 0.15), 300);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.1), 450);
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.15), 550);
  }, [playTone]);

  return {
    playClick,
    playSelect,
    playSuccess,
    playCountdown,
    playUrgentAlarm,
    playExplosion,
    playStart,
    playCelebration,
  };
};
