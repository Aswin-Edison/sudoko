import { useState, useCallback, useRef } from 'react';

/**
 * Web Audio API Sound Synthesizer Hook
 * Produces polished, clean audio effects with zero external audio assets.
 */
export function useSound(initialMuted = false) {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const stored = localStorage.getItem('zenith_sudoku_muted');
      return stored !== null ? JSON.parse(stored) : initialMuted;
    } catch {
      return initialMuted;
    }
  });

  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem('zenith_sudoku_muted', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Play number entry chime (pitch ascends smoothly with digit 1-9)
  const playPlaceNumber = useCallback((number = 1) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pentatonic / pleasant major scale frequencies based on number
      const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
      const freq = baseFreqs[Math.min(8, Math.max(0, number - 1))] || 440;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }, [isMuted, getAudioContext]);

  // Subtle click when toggling pencil note
  const playNote = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }, [isMuted, getAudioContext]);

  // Low error buzz for conflict or mistake
  const playError = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {}
  }, [isMuted, getAudioContext]);

  // Gentle erase sweep
  const playErase = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }, [isMuted, getAudioContext]);

  // Pleasant hint chime
  const playHint = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch {}
  }, [isMuted, getAudioContext]);

  // Victory fanfare
  const playWin = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const fanfare = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 659.25, d: 0.12, t: 0.12 },
        { f: 783.99, d: 0.12, t: 0.24 },
        { f: 1046.50, d: 0.35, t: 0.36 },
        { f: 880.00, d: 0.15, t: 0.72 },
        { f: 1046.50, d: 0.6, t: 0.88 }
      ];

      fanfare.forEach(({ f, d, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + d);
      });
    } catch {}
  }, [isMuted, getAudioContext]);

  // Game over sound
  const playGameOver = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [
        { f: 330, t: 0 },
        { f: 311.13, t: 0.2 },
        { f: 293.66, t: 0.4 },
        { f: 261.63, t: 0.65 }
      ];

      notes.forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + t;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {}
  }, [isMuted, getAudioContext]);

  return {
    isMuted,
    toggleMute,
    playPlaceNumber,
    playNote,
    playError,
    playErase,
    playHint,
    playWin,
    playGameOver
  };
}
