'use client';

import { useState, useRef } from 'react';
import SparklesIcon from './SparklesIcon';

export default function HolographicSeal({ size = 'md', editionNumber = '1/1 Original' }) {
  const sealRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!sealRef.current) return;
    const rect = sealRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -18;
    const rotateY = ((x - centerX) / centerX) * 18;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const sizeClasses = {
    sm: 'w-20 h-20 text-[10px]',
    md: 'w-28 h-28 text-xs',
    lg: 'w-36 h-36 text-sm',
  }[size] || 'w-28 h-28 text-xs';

  return (
    <div
      ref={sealRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(600px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`relative select-none cursor-pointer rounded-full p-1.5 shadow-2xl ${sizeClasses}`}
    >
      {/* Outer gold ring */}
      <div className="absolute inset-0 rounded-full border-2 border-gold-500/80 shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse-subtle" />

      {/* Holographic foil iridescent disc */}
      <div className="relative w-full h-full rounded-full holographic-foil flex flex-col items-center justify-center text-center p-2 border border-white/40 overflow-hidden shadow-inner">
        {/* Shimmer light sweep */}
        <div className="absolute inset-0 shimmer pointer-events-none opacity-60" />

        {/* Center seal emblem */}
        <div className="relative z-10 flex flex-col items-center text-canvas-950 font-serif">
          <SparklesIcon className="w-5 h-5 text-canvas-950 mb-0.5 animate-spin" style={{ animationDuration: '18s' }} />
          <span className="font-bold tracking-widest uppercase scale-90 leading-tight">
            ArtHub
          </span>
          <span className="text-[9px] font-sans font-semibold tracking-wider text-canvas-900/90 uppercase mt-0.5">
            Verified Seal
          </span>
          <span className="text-[8px] font-mono text-canvas-800 font-bold mt-0.5 opacity-80">
            {editionNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
