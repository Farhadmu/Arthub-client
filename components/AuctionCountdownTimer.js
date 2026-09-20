'use client';

import { useState, useEffect } from 'react';

export default function AuctionCountdownTimer({ endTime, onEnd }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
    isUrgent: false,
  });

  useEffect(() => {
    function calculateTime() {
      if (!endTime) return;
      const difference = new Date(endTime).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true, isUrgent: false });
        if (onEnd) onEnd();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Urgent if less than 1 hour remaining
      const isUrgent = difference < 60 * 60 * 1000;

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false, isUrgent });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  if (timeLeft.isEnded) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas-200 dark:bg-canvas-800 text-canvas-500 font-mono text-xs font-semibold">
        <span>AUCTION CONCLUDED</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center px-2 py-1 bg-white/60 dark:bg-canvas-800/80 rounded-lg border border-ivory-300 dark:border-canvas-700 min-w-[42px] shadow-sm">
          <span className="font-mono text-sm sm:text-base font-bold text-canvas-900 dark:text-ivory-50">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-canvas-500 dark:text-canvas-400">
            days
          </span>
        </div>
      )}

      <div className="flex flex-col items-center px-2 py-1 bg-white/60 dark:bg-canvas-800/80 rounded-lg border border-ivory-300 dark:border-canvas-700 min-w-[42px] shadow-sm">
        <span className={`font-mono text-sm sm:text-base font-bold ${timeLeft.isUrgent ? 'text-red-500 animate-pulse' : 'text-canvas-900 dark:text-ivory-50'}`}>
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-canvas-500 dark:text-canvas-400">
          hrs
        </span>
      </div>

      <span className="font-mono text-xs font-bold text-canvas-400">:</span>

      <div className="flex flex-col items-center px-2 py-1 bg-white/60 dark:bg-canvas-800/80 rounded-lg border border-ivory-300 dark:border-canvas-700 min-w-[42px] shadow-sm">
        <span className={`font-mono text-sm sm:text-base font-bold ${timeLeft.isUrgent ? 'text-red-500' : 'text-canvas-900 dark:text-ivory-50'}`}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-canvas-500 dark:text-canvas-400">
          min
        </span>
      </div>

      <span className="font-mono text-xs font-bold text-canvas-400">:</span>

      <div className="flex flex-col items-center px-2 py-1 bg-white/60 dark:bg-canvas-800/80 rounded-lg border border-ivory-300 dark:border-canvas-700 min-w-[42px] shadow-sm">
        <span className={`font-mono text-sm sm:text-base font-bold ${timeLeft.isUrgent ? 'text-red-500' : 'text-canvas-900 dark:text-ivory-50'}`}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-canvas-500 dark:text-canvas-400">
          sec
        </span>
      </div>
    </div>
  );
}
