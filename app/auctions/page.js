'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../lib/axios';
import AuctionCountdownTimer from '../../components/AuctionCountdownTimer';
import LiveBidDrawer from '../../components/LiveBidDrawer';
import SparklesIcon from '../../components/SparklesIcon';
import Loading from '../../components/Loading';
import { FiClock, FiZap, FiArrowUpRight, FiShield } from 'react-icons/fi';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedAuction, setSelectedAuction] = useState(null);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/auctions?status=${activeTab}`);
      setAuctions(data);
    } catch (err) {
      console.error('Failed to load auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [activeTab]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
          <span>Real-Time Curated Auctions</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-canvas-950 dark:text-ivory-50 tracking-tight">
          The Collector’s Live Auction Arena
        </h1>

        <p className="text-sm sm:text-base text-canvas-600 dark:text-ivory-300 leading-relaxed font-sans">
          Bid on rare 1/1 original masterpieces directly from world-renowned digital and fine artists with cryptographic provenance guarantees.
        </p>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {['ACTIVE', 'ALL', 'ENDED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-ivory-100 dark:bg-canvas-800 text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200'
              }`}
            >
              {tab === 'ACTIVE' ? 'Active Now' : tab === 'ENDED' ? 'Past Auctions' : 'All Salons'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : auctions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-canvas-900 border border-ivory-200 dark:border-canvas-800 rounded-3xl p-8">
          <FiClock className="w-12 h-12 mx-auto text-canvas-400 mb-3" />
          <h3 className="font-serif text-lg font-bold text-canvas-900 dark:text-ivory-100">
            No Auctions Found
          </h3>
          <p className="text-xs text-canvas-500 mt-1">
            Check back soon for the next premier curated auction drops.
          </p>
        </div>
      ) : (
        /* Auctions Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction._id}
              className="group bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-700/80 rounded-3xl overflow-hidden shadow-luxury-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              {/* Artwork Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={auction.artworkImage}
                  alt={auction.artworkTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Live Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                  <span className={`w-2 h-2 rounded-full ${auction.status === 'ACTIVE' ? 'bg-red-500 live-pulse' : 'bg-gray-400'}`} />
                  <span>{auction.status === 'ACTIVE' ? 'LIVE NOW' : auction.status}</span>
                </div>

                {/* Countdown overlay */}
                {auction.status === 'ACTIVE' && (
                  <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-ivory-300 tracking-wider">
                      Ends In:
                    </span>
                    <AuctionCountdownTimer endTime={auction.endTime} onEnd={fetchAuctions} />
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                      By {auction.artistName}
                    </span>
                    <span className="text-xs text-canvas-400">
                      {auction.bids?.length || 0} bids
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-canvas-900 dark:text-ivory-50 mt-1 line-clamp-1">
                    {auction.artworkTitle}
                  </h3>

                  <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-1.5 line-clamp-2 italic">
                    "{auction.curatorNotes}"
                  </p>
                </div>

                {/* Price and Action */}
                <div className="pt-3 border-t border-ivory-200 dark:border-canvas-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-canvas-400 tracking-wider block">
                      Current Bid
                    </span>
                    <div className="font-serif text-xl font-bold text-canvas-900 dark:text-ivory-100">
                      ${auction.currentBid?.toLocaleString()}
                    </div>
                  </div>

                  {auction.status === 'ACTIVE' ? (
                    <button
                      onClick={() => setSelectedAuction(auction)}
                      className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
                    >
                      <FiZap className="w-3.5 h-3.5" />
                      <span>Place Bid</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-canvas-400">
                      Concluded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-canvas-900 border border-gold-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200 dark:border-canvas-800">
              <h3 className="font-serif text-lg font-bold text-canvas-900 dark:text-ivory-50">
                Bid on "{selectedAuction.artworkTitle}"
              </h3>
              <button
                onClick={() => setSelectedAuction(null)}
                className="p-1 rounded-full hover:bg-canvas-100 dark:hover:bg-canvas-800 text-canvas-500"
              >
                ✕
              </button>
            </div>

            <LiveBidDrawer
              auction={selectedAuction}
              onBidSuccess={(updated) => {
                setSelectedAuction(updated);
                fetchAuctions();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
