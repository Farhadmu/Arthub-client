'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMaximize2, FiUser, FiEye, FiCheck, FiArrowRight } from 'react-icons/fi';

const PRESET_ARTWORKS = [
  {
    id: '1',
    title: 'Symphony in Ochre',
    artist: 'Elena Rostova',
    price: 640,
    category: 'Impasto Oil',
    image: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    title: 'The Golden Alchemist',
    artist: 'Elena Rostova',
    price: 750,
    category: '24k Gold Leaf Mixed Media',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    title: 'Obsidian Helix',
    artist: 'Elena Rostova',
    price: 1450,
    category: 'Volcanic Obsidian Sculpture',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
];

const WALL_COLORS = [
  { name: 'Warm Alabaster', color: '#F4EFEA', textDark: true },
  { name: 'Parisian Charcoal', color: '#1E232A', textDark: false },
  { name: 'Sage Heritage', color: '#4A5B4F', textDark: false },
  { name: 'Venetian Terracotta', color: '#8C4836', textDark: false },
];

const FRAMES = [
  { id: 'gold', name: 'Gold Leaf Rococo', borderClass: 'border-[14px] border-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.3)]' },
  { id: 'obsidian', name: 'Obsidian Float', borderClass: 'border-[14px] border-[#111111] shadow-[0_25px_60px_rgba(0,0,0,0.6)]' },
  { id: 'walnut', name: 'Walnut Shadowbox', borderClass: 'border-[14px] border-[#5C4033] shadow-[0_20px_45px_rgba(92,64,51,0.4)]' },
  { id: 'none', name: 'Gallery Canvas Wrap', borderClass: 'border-0 shadow-[0_20px_45px_rgba(0,0,0,0.35)]' },
];

export default function InteractiveWallShowcase({ onOpenFullModal }) {
  const [selectedArt, setSelectedArt] = useState(PRESET_ARTWORKS[0]);
  const [wallColor, setWallColor] = useState(WALL_COLORS[0]);
  const [frame, setFrame] = useState(FRAMES[0]);
  const [showSilhouette, setShowSilhouette] = useState(true);

  return (
    <section className="py-20 bg-ivory-100/50 dark:bg-canvas-950 border-t border-ivory-200 dark:border-canvas-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 mb-3">
              <span>Interactive 3D Simulation</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
              View on Your Wall <span className="text-brand-500 italic font-serif">Live</span>
            </h2>
            <p className="text-sm text-canvas-600 dark:text-ivory-300 mt-2 max-w-xl">
              Preview scale, museum frames, and custom wall colors in real-time before collecting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSilhouette(!showSilhouette)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showSilhouette
                  ? 'bg-canvas-900 text-white border-canvas-900 dark:bg-white dark:text-canvas-950'
                  : 'bg-white dark:bg-canvas-900 border-ivory-300 dark:border-canvas-700 text-canvas-700 dark:text-ivory-200'
              }`}
            >
              <FiUser />
              <span>{showSilhouette ? 'Hide 1:1 Scale' : 'Show 1:1 Scale'}</span>
            </button>

            {onOpenFullModal && (
              <button
                onClick={() => onOpenFullModal(selectedArt)}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                <FiMaximize2 />
                <span>Open 3D Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Controls & Selection */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            
            {/* 1. Artwork Selector */}
            <div className="card p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-canvas-500 dark:text-ivory-400">
                1. Select Masterwork
              </label>
              <div className="space-y-2">
                {PRESET_ARTWORKS.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArt(art)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedArt.id === art.id
                        ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500'
                        : 'border-ivory-200 dark:border-canvas-750 hover:border-canvas-400'
                    }`}
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-canvas-900 dark:text-white truncate">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-canvas-500 dark:text-ivory-400">
                        {art.category} • ${art.price}
                      </p>
                    </div>
                    {selectedArt.id === art.id && (
                      <FiCheck className="text-brand-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Frame Selector */}
            <div className="card p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-canvas-500 dark:text-ivory-400">
                2. Luxury Frame
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrame(f)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      frame.id === f.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                        : 'border-ivory-200 dark:border-canvas-750 text-canvas-700 dark:text-ivory-300 hover:border-canvas-400'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Wall Paint Color Picker */}
            <div className="card p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-canvas-500 dark:text-ivory-400">
                3. Wall Paint Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {WALL_COLORS.map((w) => (
                  <button
                    key={w.name}
                    onClick={() => setWallColor(w)}
                    style={{ backgroundColor: w.color }}
                    title={w.name}
                    className={`h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                      wallColor.name === w.name
                        ? 'border-brand-500 scale-105 shadow-md'
                        : 'border-white/40 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {wallColor.name === w.name && (
                      <FiCheck size={14} className={w.textDark ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Live Room Preview Canvas */}
          <div className="lg:col-span-8 relative min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden shadow-luxury flex flex-col justify-between p-6 sm:p-10 transition-colors duration-500"
            style={{ backgroundColor: wallColor.color }}
          >
            {/* Subtle Room Ceiling Shadow & Floor Baseboard */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-black/25 border-t border-black/20 flex items-center px-6 pointer-events-none">
              <span className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
                Museum Oak Floor Planks • 1:1 Scale
              </span>
            </div>

            {/* Top Room Meta Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <span className={`text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md ${
                wallColor.textDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white'
              }`}>
                {wallColor.name} Wall • {frame.name}
              </span>

              <Link
                href="/artworks"
                className={`text-xs font-bold inline-flex items-center gap-1 underline transition-all ${
                  wallColor.textDark ? 'text-black' : 'text-white'
                }`}
              >
                <span>Browse All 24 Artworks</span>
                <FiArrowRight />
              </Link>
            </div>

            {/* Central Framed Artwork with Smooth Transition */}
            <div className="relative z-10 my-auto flex items-end justify-center gap-8 py-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedArt.id}-${frame.id}`}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45 }}
                  className="relative group cursor-pointer max-w-sm sm:max-w-md"
                >
                  <div className={`relative rounded-sm overflow-hidden ${frame.borderClass}`}>
                    <img
                      src={selectedArt.image}
                      alt={selectedArt.title}
                      className="w-64 sm:w-80 h-72 sm:h-96 object-cover select-none"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <h3 className={`text-sm font-display font-bold ${
                      wallColor.textDark ? 'text-canvas-950' : 'text-white'
                    }`}>
                      {selectedArt.title}
                    </h3>
                    <p className={`text-xs ${
                      wallColor.textDark ? 'text-canvas-600' : 'text-ivory-300'
                    }`}>
                      {selectedArt.artist} • ${selectedArt.price}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Human Silhouette for Scale Reference */}
              {showSilhouette && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 0.35, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="hidden sm:flex flex-col items-center select-none pointer-events-none pb-4"
                >
                  <svg className="w-16 h-72 text-canvas-950" viewBox="0 0 100 300" fill="currentColor">
                    <circle cx="50" cy="30" r="18" />
                    <path d="M30 65 C30 55, 70 55, 70 65 L75 140 C75 145, 68 150, 65 150 L65 290 C65 295, 55 295, 55 290 L52 180 L48 180 L45 290 C45 295, 35 295, 35 290 L35 150 C32 150, 25 145, 25 140 Z" />
                  </svg>
                  <span className={`text-[10px] font-mono mt-1 ${
                    wallColor.textDark ? 'text-black/60' : 'text-white/60'
                  }`}>
                    175 cm Scale
                  </span>
                </motion.div>
              )}

            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 pt-4" />

          </div>

        </div>

      </div>
    </section>
  );
}
