'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiZap, FiArrowRight, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi';
import AuctionCountdownTimer from './AuctionCountdownTimer';
import api from '@/lib/axios';

export default function HomeAuctionSpotlight() {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpotlight() {
      try {
        const res = await api.get('/auctions/spotlight');
        if (res.data) setAuction(res.data);
      } catch (err) {
        console.error('Failed to load auction spotlight:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSpotlight();
  }, []);

  if (loading || !auction) {
    return null; // Gracefully degrade if no auctions available
  }

  const artwork = auction.artwork || {};
  const currentBid = auction.currentBid || auction.startingPrice || 480;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-canvas-950 to-canvas-900 text-white border-y border-gold-500/20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
              <span>Live Auction Spotlight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              Active Bidding <span className="text-gold-400 italic font-serif">Arena</span>
            </h2>
            <p className="text-xs sm:text-sm text-ivory-300 mt-1 max-w-lg">
              Place competitive bids on rare, verified 1/1 original creations with dynamic anti-sniping protection.
            </p>
          </div>

          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-canvas-950 font-bold text-xs tracking-wide transition-all shadow-luxury-sm self-start sm:self-auto"
          >
            <span>Explore All Auctions</span>
            <FiArrowRight />
          </Link>
        </div>

        {/* Highlight Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-canvas-900/90 border border-gold-500/30 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center backdrop-blur-md">
          
          {/* Left: Image with LIVE badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden border border-gold-500/30">
              <img
                src={artwork.image || auction.artworkImage || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80'}
                alt={artwork.title || auction.artworkTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-950/80 backdrop-blur-md border border-red-500/40 text-white text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
                <span>LIVE LOT #1</span>
              </div>
            </div>
          </div>

          {/* Right: Bidding details & Countdown */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                {artwork.category || 'Fine Art'} • Curated Selection
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                {artwork.title || auction.artworkTitle}
              </h3>
              <p className="text-xs text-ivory-400 mt-1">
                by {auction.artistName || auction.artist?.name || 'Master Artist'}
              </p>
            </div>

            {/* Countdown & Current Bid Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-canvas-950/80 border border-canvas-800">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-canvas-400 block mb-1">
                  Time Remaining
                </span>
                <AuctionCountdownTimer targetDate={auction.endTime} />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-canvas-400 block mb-1">
                  Current Highest Bid
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-black text-gold-400">
                    ${currentBid.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <FiTrendingUp />
                    <span>Active</span>
                  </span>
                </div>
                <span className="text-[11px] text-canvas-400">
                  Min next bid: ${(currentBid + (auction.minIncrement || 25)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/auctions`}
                className="btn-gold py-3.5 px-8 text-sm font-bold shadow-glow"
              >
                <span>Place Instant Bid</span>
                <FiZap />
              </Link>

              <div className="inline-flex items-center gap-2 text-xs text-ivory-400">
                <FiShield className="text-gold-400" />
                <span>Anti-sniping 2-min auto-extension active</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
