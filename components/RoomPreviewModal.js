'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiMaximize2, FiMinimize2, FiLayers } from 'react-icons/fi';
import SparklesIcon from './SparklesIcon';

export default function RoomPreviewModal({ isOpen, onClose, artwork }) {
  const [selectedRoom, setSelectedRoom] = useState('living');
  const [selectedFrame, setSelectedFrame] = useState('gold');
  const [wallColor, setWallColor] = useState('#EFECE6');
  const [artworkScale, setArtworkScale] = useState('medium'); // small, medium, large, hero
  const [showSilhouette, setShowSilhouette] = useState(true);

  if (!isOpen || !artwork) return null;

  // Pre-configured luxury room backgrounds
  const rooms = [
    { id: 'living', name: 'Minimalist Loft', baseColor: '#EFECE6' },
    { id: 'gallery', name: 'Metropolitan Museum', baseColor: '#DFDDD7' },
    { id: 'salon', name: 'Obsidian Salon', baseColor: '#171B24' },
    { id: 'studio', name: 'Nordic Studio', baseColor: '#F8F6F0' },
    { id: 'office', name: 'Executive Suite', baseColor: '#2B303A' },
  ];

  // Luxury Frame Styles
  const frames = [
    {
      id: 'gold',
      name: 'Champagne Gold Leaf',
      class: 'border-8 border-gold-500 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.3)]',
    },
    {
      id: 'obsidian',
      name: 'Obsidian Matte Wood',
      class: 'border-8 border-canvas-950 shadow-[0_15px_35px_rgba(0,0,0,0.6)]',
    },
    {
      id: 'oak',
      name: 'Natural Scandinavian Oak',
      class: 'border-8 border-[#C8AD8D] shadow-[0_15px_30px_rgba(0,0,0,0.4)]',
    },
    {
      id: 'floating',
      name: 'Gallery Floating Canvas',
      class: 'p-2 bg-black/40 shadow-[0_20px_45px_rgba(0,0,0,0.55)]',
    },
    {
      id: 'frameless',
      name: 'Modern Frameless',
      class: 'shadow-[0_20px_40px_rgba(0,0,0,0.45)]',
    },
  ];

  // Dimension scaling mapping
  const scaleStyles = {
    small: { width: '160px', height: '220px', label: '16" × 22" (Gallery Accent)' },
    medium: { width: '230px', height: '310px', label: '24" × 32" (Living Statement)' },
    large: { width: '310px', height: '410px', label: '36" × 48" (Collector Hero)' },
    hero: { width: '380px', height: '490px', label: '48" × 64" (Museum Scale)' },
  };

  const currentScale = scaleStyles[artworkScale] || scaleStyles.medium;
  const currentFrameObj = frames.find((f) => f.id === selectedFrame) || frames[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-canvas-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-ivory-50 dark:bg-canvas-900 border border-ivory-300 dark:border-canvas-750 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-200 dark:border-canvas-800 bg-white/50 dark:bg-canvas-900/50 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
              <SparklesIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-canvas-900 dark:text-ivory-50">
                View on Your Wall · 3D Gallery Simulation
              </h2>
              <p className="text-xs text-canvas-500 dark:text-ivory-400">
                "{artwork.title}" by {artwork.artistName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-canvas-200 dark:hover:bg-canvas-800 text-canvas-500 hover:text-canvas-900 dark:hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* 3D Wall Preview Stage */}
        <div
          className="relative flex-1 flex flex-col items-center justify-center overflow-hidden select-none transition-colors duration-500 p-6"
          style={{ backgroundColor: wallColor }}
        >
          {/* Subtle architectural wall shading */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />

          {/* Floor & Baseboard Line */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-black/20 via-[#443831] to-[#2B231F] border-t-8 border-[#1F1916] shadow-2xl flex items-end justify-center">
            {/* Hardwood floor perspective lines */}
            <div className="w-full h-full opacity-30 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Wall Lamp Lighting Spotlight */}
          <div className="absolute top-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top,rgba(255,248,220,0.45)_0%,transparent_70%)] pointer-events-none" />

          {/* The Framed Artwork hanging on the wall */}
          <div
            className="relative z-10 transition-all duration-300 flex items-center justify-center -translate-y-6"
            style={{
              width: currentScale.width,
              height: currentScale.height,
            }}
          >
            {/* Drop shadow on wall */}
            <div className={`relative w-full h-full rounded-sm overflow-hidden ${currentFrameObj.class} bg-black`}>
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              {/* Glass glare reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-60" />
            </div>
          </div>

          {/* Human Silhouette reference for true-to-life scale */}
          {showSilhouette && (
            <div className="absolute bottom-16 right-12 z-10 flex flex-col items-center opacity-75 pointer-events-none">
              <svg width="48" height="150" viewBox="0 0 50 160" fill="currentColor" className="text-canvas-800/80 dark:text-canvas-400/60 drop-shadow-md">
                <circle cx="25" cy="18" r="12" />
                <path d="M12 40 C12 35, 38 35, 38 40 L44 95 L34 95 L34 155 L28 155 L28 105 L22 105 L22 155 L16 155 L16 95 L6 95 Z" />
              </svg>
              <span className="text-[10px] font-sans font-medium text-canvas-700 dark:text-canvas-300 mt-1 bg-white/70 dark:bg-canvas-900/80 px-1.5 py-0.5 rounded shadow-sm">
                5'9" (175cm)
              </span>
            </div>
          )}

          {/* Sofa Reference element at base */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-80 sm:w-96 h-20 rounded-t-2xl bg-canvas-800/80 dark:bg-canvas-950/80 border-t-2 border-canvas-700/50 shadow-2xl flex items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-canvas-400/80 font-medium">
              Designer Living Sofa
            </span>
          </div>
        </div>

        {/* Interactive Customization Studio Controls */}
        <div className="p-4 sm:p-5 bg-white dark:bg-canvas-900 border-t border-ivory-200 dark:border-canvas-800 z-20 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* 1. Room Preset */}
            <div>
              <label className="font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5 block">
                1. Room Environment
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoom(room.id);
                      setWallColor(room.baseColor);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedRoom === room.id
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-ivory-100 dark:bg-canvas-800 text-canvas-700 dark:text-ivory-300 hover:bg-ivory-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Frame Selector */}
            <div>
              <label className="font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5 block">
                2. Luxury Frame
              </label>
              <select
                value={selectedFrame}
                onChange={(e) => setSelectedFrame(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-ivory-300 dark:border-canvas-700 bg-white dark:bg-canvas-800 text-canvas-900 dark:text-ivory-100 font-medium outline-none focus:ring-1 focus:ring-brand-500"
              >
                {frames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Scale Selector */}
            <div>
              <label className="font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5 block">
                3. Physical Scale
              </label>
              <div className="flex gap-1">
                {Object.keys(scaleStyles).map((scaleKey) => (
                  <button
                    key={scaleKey}
                    onClick={() => setArtworkScale(scaleKey)}
                    className={`flex-1 py-1.5 px-2 rounded-lg capitalize font-medium transition-all ${
                      artworkScale === scaleKey
                        ? 'bg-gold-500 text-white font-bold shadow-sm'
                        : 'bg-ivory-100 dark:bg-canvas-800 text-canvas-700 dark:text-ivory-300 hover:bg-ivory-200'
                    }`}
                  >
                    {scaleKey}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Wall Color & Scale Silhouette Toggle */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5 block">
                  Wall Paint
                </label>
                <div className="flex items-center gap-1.5">
                  {['#EFECE6', '#F3EDE2', '#D3D8D7', '#252D3A', '#1E242B', '#8C3D2B'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setWallColor(c)}
                      className={`w-5 h-5 rounded-full border border-black/20 transition-transform ${
                        wallColor === c ? 'scale-125 ring-2 ring-brand-500' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    title="Custom color"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowSilhouette(!showSilhouette)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  showSilhouette
                    ? 'bg-canvas-800 text-white dark:bg-ivory-100 dark:text-canvas-900 border-transparent'
                    : 'border-canvas-300 dark:border-canvas-700 text-canvas-500'
                }`}
                title="Toggle 5'9 human silhouette reference"
              >
                Scale Reference
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
