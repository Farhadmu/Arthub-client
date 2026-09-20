'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FiHeart, FiEye, FiArrowUpRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';

export default function ArtworkCard({ artwork }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);

  if (!artwork) return null;

  const wishlisted = isWishlisted(artwork._id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    await toggleWishlist(artwork);
    setTimeout(() => setHeartAnimating(false), 400);
  };

  const displayImage = imageError
    ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80'
    : (artwork.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80');

  const artistName = artwork.artistName || artwork.artist?.name || 'ArtHub Creator';
  const artistId = artwork.artist?._id || artwork.artist;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="card group flex flex-col relative h-full bg-white dark:bg-canvas-850"
    >
      <div className="relative overflow-hidden aspect-[4/4.5] bg-ivory-100 dark:bg-canvas-800">
        <Link href={`/artworks/${artwork._id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={artwork.altText || artwork.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Category & Status Pills */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-canvas-900/80 backdrop-blur-md text-ivory-100 px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 shadow-sm">
            {artwork.category}
          </span>
          {artwork.style && (
            <span className="hidden sm:inline-block bg-white/85 dark:bg-canvas-800/85 backdrop-blur-md text-canvas-700 dark:text-ivory-300 px-2 py-0.5 rounded-full text-[11px] font-normal border border-ivory-300 dark:border-white/5">
              {artwork.style}
            </span>
          )}
        </div>

        {artwork.isSold && (
          <div className="absolute top-3 right-14 bg-red-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
            Sold
          </div>
        )}

        {/* Wishlist Button (Optimized, O(1) context lookup, zero duplicate requests) */}
        <button
          onClick={handleHeartClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
            wishlisted
              ? 'bg-red-500 text-white shadow-red-500/30'
              : 'bg-white/80 dark:bg-canvas-900/80 text-canvas-700 dark:text-ivory-200 hover:text-red-500 dark:hover:text-red-400 hover:scale-110'
          }`}
        >
          <motion.div
            animate={heartAnimating ? { scale: [1, 1.35, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <FiHeart
              size={17}
              className={wishlisted ? 'fill-current text-white' : ''}
            />
          </motion.div>
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-950/80 via-canvas-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
          <Link
            href={`/artworks/${artwork._id}`}
            className="w-full pointer-events-auto inline-flex items-center justify-center gap-2 bg-white/95 dark:bg-canvas-800/95 backdrop-blur-md text-canvas-900 dark:text-ivory-100 text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-colors"
          >
            <FiEye size={15} />
            <span>Examine Artwork</span>
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/artworks/${artwork._id}`}>
            <h3 className="font-display font-semibold text-base sm:text-lg text-canvas-900 dark:text-ivory-100 group-hover:text-brand-500 transition-colors line-clamp-1">
              {artwork.title}
            </h3>
          </Link>

          <div className="mt-1 flex items-center justify-between text-xs text-canvas-500 dark:text-ivory-400">
            {artistId ? (
              <Link
                href={`/artists/${artistId}`}
                className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors line-clamp-1"
              >
                by <span className="font-medium text-canvas-700 dark:text-ivory-200">{artistName}</span>
              </Link>
            ) : (
              <span>by {artistName}</span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-ivory-200 dark:border-canvas-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-canvas-400 dark:text-canvas-500 block">Price</span>
            <span className="text-lg font-bold font-sans text-brand-600 dark:text-brand-400">
              ${artwork.price?.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/artworks/${artwork._id}`}
            className="text-xs font-semibold text-canvas-600 dark:text-ivory-300 hover:text-brand-500 dark:hover:text-brand-400 inline-flex items-center gap-1 transition-colors group/link"
          >
            <span>Details</span>
            <FiArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}