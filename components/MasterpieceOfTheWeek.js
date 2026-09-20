'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeadphones, FiShield, FiArrowRight, FiStar, FiCheckCircle } from 'react-icons/fi';
import HolographicSeal from './HolographicSeal';
import AudioGuidePlayer from './AudioGuidePlayer';
import api from '@/lib/axios';

export default function MasterpieceOfTheWeek() {
  const [spotlight, setSpotlight] = useState(null);
  const [showAudio, setShowAudio] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotlight() {
      try {
        const res = await api.get('/artworks/spotlight');
        if (res.data) setSpotlight(res.data);
      } catch (err) {
        console.error('Failed to load spotlight artwork:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpotlight();
  }, []);

  if (loading || !spotlight || !spotlight.artwork) return null;

  const { artwork, curatorVerdict } = spotlight;

  return (
    <section className="py-20 bg-white dark:bg-canvas-900 border-t border-ivory-200 dark:border-canvas-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">
            <FiStar className="fill-current" />
            <span>Curator's Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-canvas-950 dark:text-white">
            Masterwork of the <span className="text-brand-500 italic font-serif">Week</span>
          </h2>
          <p className="text-xs sm:text-sm text-canvas-600 dark:text-ivory-300 mt-2">
            Selected by ArtHub's Chief Curatorial Panel for emotional depth and unparalleled technical mastery.
          </p>
        </div>

        {/* Exhibition Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-6 sm:p-12 rounded-3xl bg-ivory-50 dark:bg-canvas-850 border border-ivory-300 dark:border-canvas-750 shadow-luxury">
          
          {/* Left Column: High-Res Framed Artwork */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-8 border-white dark:border-canvas-800 max-w-md w-full">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <Link
                  href={`/artworks/${artwork._id}`}
                  className="btn-primary text-xs py-2 px-4 w-full justify-center"
                >
                  <span>Examine Provenance & High-Res</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>

            {/* Float Holographic Seal Badge */}
            <div className="absolute -bottom-5 -right-2 sm:right-6 scale-90 sm:scale-100 drop-shadow-xl">
              <HolographicSeal size={100} title="MASTERPIECE" edition="1 OF 1" />
            </div>
          </div>

          {/* Right Column: Curatorial Essay & Audio Player */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                {artwork.category} • {artwork.style || 'Contemporary'}
              </span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
                {artwork.title}
              </h3>
              <p className="text-sm font-medium text-canvas-600 dark:text-ivory-300">
                Created by <span className="text-canvas-900 dark:text-white font-bold">{artwork.artistName || artwork.artist?.name}</span>
              </p>
            </div>

            {/* Curatorial Verdict Blockquote */}
            <div className="p-5 rounded-2xl bg-white dark:bg-canvas-900 border-l-4 border-gold-500 border-y border-r border-ivory-200 dark:border-canvas-800 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                Curator's Note
              </span>
              <p className="text-xs sm:text-sm text-canvas-700 dark:text-ivory-200 italic font-serif leading-relaxed">
                "{curatorVerdict}"
              </p>
            </div>

            {/* Features Checklist */}
            <div className="grid grid-cols-2 gap-3 text-xs text-canvas-600 dark:text-ivory-300">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>SHA-256 Digital COA</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>3D / AR Room Simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Audio Guide Narration</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Museum Archival Materials</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowAudio(!showAudio)}
                className="btn-secondary py-3 px-5 text-xs font-bold border-brand-500/30 hover:border-brand-500 text-canvas-900 dark:text-white"
              >
                <FiHeadphones className="text-brand-500" />
                <span>{showAudio ? 'Hide Audio Guide' : 'Listen to Audio Guide'}</span>
              </button>

              <Link
                href={`/artworks/${artwork._id}`}
                className="btn-primary py-3 px-6 text-xs font-bold shadow-glow"
              >
                <span>Acquire for ${artwork.price}</span>
                <FiArrowRight />
              </Link>
            </div>

            {/* Interactive Audio Player Drawer */}
            {showAudio && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2"
              >
                <AudioGuidePlayer artwork={artwork} />
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
