import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for game timer.
 * Automatically pauses when document is hidden (switching tabs) or when isPaused is true.
 */
export function useTimer(isActive = true, isPaused = false, initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const timerRef = useRef(null);

  // Sync initialSeconds when resuming a saved game
  const resetTimer = useCallback((newInitialSeconds = 0) => {
    setSeconds(newInitialSeconds);
  }, []);

  // Handle visibility changes (pausing automatically when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer interval effect
  useEffect(() => {
    const shouldRun = isActive && !isPaused && isTabVisible;

    if (shouldRun) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused, isTabVisible]);

  // Format seconds as MM:SS (or HH:MM:SS if > 1 hour)
  const formatTime = useCallback((totalSeconds = seconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = num => String(num).padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }, [seconds]);

  return {
    seconds,
    formattedTime: formatTime(seconds),
    formatTime,
    resetTimer,
    setSeconds
  };
}
