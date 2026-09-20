'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SparklesIcon from './SparklesIcon';
import { FiX, FiHeart, FiThumbsDown, FiRotateCcw, FiArrowRight } from 'react-icons/fi';

export default function ArtMatchmaker({ isOpen, onClose, artworks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedArtworks, setLikedArtworks] = useState([]);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const currentArtwork = artworks[currentIndex];

  const handleSwipe = (isLike) => {
    if (isLike && currentArtwork) {
      setLikedArtworks((prev) => [...prev, currentArtwork]);
    }

    if (currentIndex + 1 >= Math.min(artworks.length, 6)) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedArtworks([]);
    setCompleted(false);
  };

  // Extract collector taste archetype from liked artworks
  const dominantStyles = likedArtworks.map((a) => a.style || 'Contemporary');
  const dominantMoods = likedArtworks.map((a) => a.mood || 'Inspiring');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-ivory-50 dark:bg-canvas-900 border border-ivory-300 dark:border-canvas-750 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-ivory-200 dark:border-canvas-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
              <SparklesIcon className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-base font-bold text-canvas-900 dark:text-ivory-50">
              Art Matchmaker · Taste DNA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-canvas-200 dark:hover:bg-canvas-800 text-canvas-400"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {!completed && currentArtwork ? (
          <div className="w-full flex flex-col items-center py-4 space-y-4">
            {/* Card Counter Indicator */}
            <div className="w-full flex items-center justify-between text-[11px] text-canvas-500 font-medium">
              <span>Card {currentIndex + 1} of {Math.min(artworks.length, 6)}</span>
              <span className="text-gold-500 font-semibold uppercase tracking-wider">Swipe Discovery</span>
            </div>

            {/* Artwork Card */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-ivory-300 dark:border-canvas-700 shadow-luxury group select-none">
              <img
                src={currentArtwork.image}
                alt={currentArtwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas-950/90 via-canvas-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/80 w-fit mb-1 font-semibold">
                  {currentArtwork.category} · {currentArtwork.style}
                </span>
                <h4 className="font-serif text-lg font-bold line-clamp-1">{currentArtwork.title}</h4>
                <p className="text-xs text-ivory-300">{currentArtwork.artistName}</p>
                <div className="font-serif text-sm font-semibold text-gold-400 mt-1">
                  ${currentArtwork.price?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Swipe Action Buttons */}
            <div className="flex items-center gap-6 pt-2">
              <button
                onClick={() => handleSwipe(false)}
                className="w-14 h-14 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-90"
                title="Pass"
              >
                <FiThumbsDown className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleSwipe(true)}
                className="w-16 h-16 rounded-full bg-brand-500 text-white hover:bg-brand-600 flex items-center justify-center transition-all shadow-glow active:scale-90"
                title="Collect / Love"
              >
                <FiHeart className="w-7 h-7 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          /* Collector DNA Results */
          <div className="w-full py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-500 shadow-glow-gold">
              <SparklesIcon className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                Collector DNA Generated
              </span>
              <h4 className="font-serif text-2xl font-bold text-canvas-900 dark:text-ivory-50 mt-1">
                {dominantStyles[0] || 'Contemporary'} Connoisseur
              </h4>
              <p className="text-xs text-canvas-600 dark:text-ivory-300 max-w-xs mx-auto mt-2 leading-relaxed">
                Your artistic sensibility leans toward{' '}
                <strong className="text-brand-600 dark:text-brand-400">
                  {dominantStyles.slice(0, 2).join(' and ')}
                </strong>{' '}
                evoking a <strong className="text-gold-500">{dominantMoods[0] || 'serene'}</strong> ambiance.
              </p>
            </div>

            {/* Matched pieces preview */}
            <div className="p-4 rounded-2xl bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-800 text-left">
              <span className="text-[10px] uppercase font-bold text-canvas-400 tracking-wider block mb-2">
                Your Preferred Masterpieces ({likedArtworks.length})
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {likedArtworks.map((art) => (
                  <Link
                    key={art._id}
                    href={`/artworks/${art._id}`}
                    onClick={onClose}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden relative group border border-ivory-300 dark:border-canvas-700"
                  >
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleReset}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
                <span>Swipe Again</span>
              </button>

              <button
                onClick={onClose}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
              >
                <span>Explore Curated Gallery</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
