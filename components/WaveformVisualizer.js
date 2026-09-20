'use client';

import { useEffect, useRef } from 'react';

export default function WaveformVisualizer({ isPlaying = false, barCount = 28 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        // Calculate dynamic height based on sine wave and randomized audio jitter when playing
        let barHeight = 4;
        if (isPlaying) {
          const wave = Math.sin(phase + (i * 0.35)) * 0.5 + 0.5;
          const jitter = Math.random() * 0.3;
          barHeight = Math.max(6, (wave + jitter) * (height * 0.75));
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        // Gradient from brand gold to vibrant orange
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#E07A5F');
          gradient.addColorStop(0.5, '#D4AF37');
          gradient.addColorStop(1, '#F0D984');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.12;
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, barCount]);

  return (
    <div className="w-full flex items-center justify-center py-2 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={340}
        height={36}
        className="w-full max-w-sm h-9"
      />
    </div>
  );
}
