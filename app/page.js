'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import { ArtworkCardSkeleton } from '@/components/Loading';
import SparklesIcon from '@/components/SparklesIcon';
import HomePaletteBar from '@/components/HomePaletteBar';
import MasterpieceOfTheWeek from '@/components/MasterpieceOfTheWeek';
import InteractiveWallShowcase from '@/components/InteractiveWallShowcase';
import HomeAuctionSpotlight from '@/components/HomeAuctionSpotlight';
import MatchmakerTeaser from '@/components/MatchmakerTeaser';
import { useUI } from '@/context/UIContext';
import api from '@/lib/axios';
import {
  FiArrowRight, FiImage, FiShield,
  FiZap, FiCompass, FiStar, FiHeart, FiTrendingUp
} from 'react-icons/fi';

export default function HomePage() {
  const { openCurator, openVisualSearch } = useUI();
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksRes, artistsRes, recsRes] = await Promise.all([
          api.get('/artworks/featured'),
          api.get('/artworks/top-artists'),
          api.get('/ai/recommendations?limit=6').catch(() => ({ data: null })),
        ]);
        setFeaturedArtworks(artworksRes.data || []);
        setTopArtists(artistsRes.data || []);
        if (recsRes.data) setRecommendations(recsRes.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Painting', count: 'Original Oils & Acrylics', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80' },
    { name: 'Digital', count: 'Generative & Concept Art', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' },
    { name: 'Sculpture', count: 'Physical & 3D Forms', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    { name: 'Photography', count: 'Fine Art Captures', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80' },
    { name: 'Illustration', count: 'Narrative & Editorial', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80' },
  ];

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 overflow-hidden">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-ivory-200 dark:border-canvas-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Live Auction Ticker Banner */}
          <Link
            href="/auctions"
            className="group mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-canvas-900/90 text-white border border-gold-500/40 shadow-luxury-sm hover:shadow-luxury hover:border-gold-500 transition-all text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
            <span className="font-semibold text-gold-400 uppercase tracking-widest text-[10px]">
              Live Auction Arena
            </span>
            <span className="text-canvas-300 hidden sm:inline">·</span>
            <span className="text-ivory-200 hidden sm:inline">
              Active bidding on curated 1/1 original masterworks
            </span>
            <span className="font-semibold text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Enter Arena</span>
              <span>→</span>
            </span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-wide">
                <SparklesIcon className="animate-pulse" />
                <span>THE INTELLIGENT ART MARKETPLACE</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-canvas-950 dark:text-white tracking-tight leading-[1.08]">
                Discover Art <br />
                <span className="italic font-normal font-serif text-brand-500">Beyond</span> Imagination.
              </h1>

              <p className="text-base sm:text-lg text-canvas-600 dark:text-ivory-300 max-w-xl font-normal leading-relaxed">
                Connect with visionary global artists through conversational AI curation, visual similarity search, and verified collector transactions.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/artworks"
                  className="btn-primary text-sm py-3.5 px-7 shadow-glow"
                >
                  <span>Explore Artworks</span>
                  <FiArrowRight />
                </Link>

                <button
                  onClick={openCurator}
                  className="btn-secondary text-sm py-3.5 px-6 border-brand-500/30 hover:border-brand-500 text-canvas-900 dark:text-ivory-100"
                >
                  <SparklesIcon className="text-brand-500" />
                  <span>Meet ArtHub AI</span>
                </button>

                <button
                  onClick={openVisualSearch}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-canvas-500 hover:text-brand-500 dark:text-ivory-400 p-2"
                >
                  <FiImage size={16} />
                  <span>Search by Image</span>
                </button>
              </div>

              {/* Trust Metric Chips */}
              <div className="pt-8 border-t border-ivory-200 dark:border-canvas-800/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-2xl font-bold font-display text-canvas-900 dark:text-white">100%</span>
                  <span className="text-xs text-canvas-500 dark:text-ivory-400">Authentic Creators</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-display text-canvas-900 dark:text-white">&lt;100ms</span>
                  <span className="text-xs text-canvas-500 dark:text-ivory-400">AI Visual Search</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-display text-canvas-900 dark:text-white">Stripe</span>
                  <span className="text-xs text-canvas-500 dark:text-ivory-400">Secured Checkout</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Dynamic Art Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-luxury border border-ivory-200 dark:border-canvas-700 bg-white dark:bg-canvas-850 p-3">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-ivory-200 dark:bg-canvas-800">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&q=85"
                    alt="Featured Collection Exhibition"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-950/80 via-canvas-950/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/85 dark:bg-canvas-900/85 backdrop-blur-md border border-white/20 dark:border-canvas-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                        AI Selected Highlight
                      </span>
                      <h3 className="font-display font-bold text-sm text-canvas-900 dark:text-white">
                        Whispers of Midnight
                      </h3>
                      <p className="text-xs text-canvas-500 dark:text-ivory-400">
                        by Elena Rostova • Abstract Oil
                      </p>
                    </div>
                    <Link
                      href="/artworks"
                      className="btn-primary text-xs py-2 px-3.5 shadow-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative Blur Orbs */}
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hero Interior Color Bar */}
      <HomePaletteBar />

      {/* 2. AI VISUAL DISCOVERY BANNER */}
      <section className="py-12 bg-white dark:bg-canvas-900 border-b border-ivory-200 dark:border-canvas-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-500/10 via-ivory-100 dark:via-canvas-850 to-gold-500/10 border border-brand-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
                <FiZap />
                <span>Instant Image Matching</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-canvas-950 dark:text-white">
                Have an artwork or photo in mind?
              </h3>
              <p className="text-sm text-canvas-600 dark:text-ivory-300 max-w-xl">
                Upload any image to find visually matching original paintings, digital artworks, and photographs across our verified creators.
              </p>
            </div>

            <button
              onClick={openVisualSearch}
              className="btn-ai text-sm py-3 px-6 whitespace-nowrap"
            >
              <FiImage size={18} />
              <span>Launch Visual Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ARTWORKS EXHIBITION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">
              <FiCompass />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
              Featured Artworks
            </h2>
            <p className="text-sm text-canvas-500 dark:text-ivory-400 mt-1">
              Handpicked gallery pieces celebrated for emotional resonance and technique
            </p>
          </div>

          <Link
            href="/artworks"
            className="btn-outline text-xs py-2.5 px-5 self-start sm:self-auto"
          >
            <span>View All Artworks</span>
            <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ArtworkCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.slice(0, 8).map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        )}
      </section>

      {/* CURATOR'S SPOTLIGHT: MASTERWORK OF THE WEEK */}
      <MasterpieceOfTheWeek />

      {/* 4. AI-POWERED PERSONALIZED RECOMMENDATIONS (If available) */}
      {recommendations?.recommendedForYou?.length > 0 && (
        <section className="py-16 bg-ivory-100/60 dark:bg-canvas-900 border-y border-ivory-200 dark:border-canvas-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-glow">
                  <SparklesIcon size={18} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-canvas-950 dark:text-white">
                    Curated For You
                  </h2>
                  <p className="text-xs text-canvas-500 dark:text-ivory-400">
                    Artworks matched dynamically to aesthetic trends and community interactions
                  </p>
                </div>
              </div>

              <button
                onClick={openCurator}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Ask ArtHub AI</span>
                <FiArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.recommendedForYou.slice(0, 4).map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. BROWSE BY CATEGORY */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
            Explore by Medium
          </h2>
          <p className="text-sm text-canvas-500 dark:text-ivory-400 mt-2">
            Immerse yourself across physical canvases, digital forms, and tactile sculptures
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/artworks?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md border border-ivory-300 dark:border-canvas-750"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas-950/90 via-canvas-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-display font-bold text-lg leading-snug">
                  {cat.name}
                </h3>
                <p className="text-ivory-300 text-[11px] font-medium mt-0.5 line-clamp-1">
                  {cat.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3D ROOM & WALL SIMULATION SHOWCASE */}
      <InteractiveWallShowcase />

      {/* 6. TOP CELEBRATED ARTISTS */}
      <section className="py-16 bg-white dark:bg-canvas-900 border-t border-ivory-200 dark:border-canvas-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-canvas-950 dark:text-white">
                Featured Artists
              </h2>
              <p className="text-sm text-canvas-500 dark:text-ivory-400 mt-1">
                Creators sharing their visual voice on ArtHub
              </p>
            </div>
            <Link
              href="/register"
              className="btn-secondary text-xs py-2.5 px-4 hidden sm:inline-flex"
            >
              Join as Artist
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topArtists.map((artist, idx) => (
              <div
                key={artist._id}
                className="card p-6 text-center flex flex-col items-center justify-between"
              >
                <div className="relative mb-4">
                  {artist.avatar ? (
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500/40 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-gold-500 flex items-center justify-center text-white text-2xl font-bold font-display shadow-md">
                      {artist.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                  )}
                  {idx === 0 && (
                    <div className="absolute -top-2 -right-2 bg-gold-500 text-white rounded-full p-1.5 shadow-sm" title="Top Seller">
                      <FiStar size={13} className="fill-current" />
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100">
                  {artist.name}
                </h3>
                <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-0.5">
                  {artist.count || 0} pieces collected
                </p>

                <div className="mt-4 w-full pt-4 border-t border-ivory-200 dark:border-canvas-750">
                  <Link
                    href={`/artists/${artist._id}`}
                    className="btn-outline w-full text-xs py-2 justify-center"
                  >
                    View Studio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE AUCTION ARENA SPOTLIGHT */}
      <HomeAuctionSpotlight />

      {/* 7. HOW ARTHUB WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold text-canvas-950 dark:text-white">
            The Collector Journey
          </h2>
          <p className="text-sm text-canvas-500 dark:text-ivory-400 mt-2">
            Seamless curation and secure ownership powered by intelligent technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-display font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-display font-bold text-canvas-900 dark:text-ivory-100">
              AI-Assisted Discovery
            </h3>
            <p className="text-xs sm:text-sm text-canvas-600 dark:text-ivory-300 leading-relaxed">
              Describe your ambiance, room palette, or budget to ArtHub AI, or drop any reference photo to locate matching originals in milliseconds.
            </p>
          </div>

          <div className="card p-8 text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center font-display font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-display font-bold text-canvas-900 dark:text-ivory-100">
              Direct Artist Support
            </h3>
            <p className="text-xs sm:text-sm text-canvas-600 dark:text-ivory-300 leading-relaxed">
              Every purchase directly funds original creators worldwide. Enjoy transparent pricing with zero undisclosed gallery markups.
            </p>
          </div>

          <div className="card p-8 text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-display font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-display font-bold text-canvas-900 dark:text-ivory-100">
              Guaranteed Ownership
            </h3>
            <p className="text-xs sm:text-sm text-canvas-600 dark:text-ivory-300 leading-relaxed">
              Complete transactions securely with Stripe Checkout. Track order fulfillment and unlock verified buyer reviews on the artwork page.
            </p>
          </div>
        </div>
      </section>

      {/* 8. AI ART CURATOR BANNER CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-500 p-8 sm:p-14 text-white text-center shadow-luxury relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold">
              <SparklesIcon />
              <span>Available 24/7 in your browser</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold leading-tight">
              Ready to meet your personal AI Art Curator?
            </h2>

            <p className="text-sm sm:text-base text-white/90">
              Whether curating a whole gallery wall or finding the singular masterpiece for your space, ArtHub AI is here to guide you.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={openCurator}
                className="bg-white text-canvas-950 hover:bg-ivory-100 font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all active:scale-95 text-sm"
              >
                Start Curating with ArtHub AI
              </button>

              <Link
                href="/artworks"
                className="border border-white/40 hover:bg-white/10 text-white font-semibold py-3.5 px-6 rounded-xl transition-all text-sm"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}