'use client';

import { useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiDollarSign, FiZap, FiArrowUp, FiAlertCircle } from 'react-icons/fi';
import SparklesIcon from './SparklesIcon';

export default function LiveBidDrawer({ auction, onBidSuccess }) {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!auction) return null;

  const currentBid = auction.currentBid || auction.startingPrice || 0;
  const minIncrement = auction.minIncrement || 25;
  const minNextBid = currentBid + minIncrement;

  const handleQuickAdd = (increment) => {
    setBidAmount(String(currentBid + increment));
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to place a bid on this masterwork');
      return;
    }

    const amountNum = Number(bidAmount);
    if (!amountNum || amountNum < minNextBid) {
      toast.error(`Minimum bid is $${minNextBid.toLocaleString()}`);
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post(`/auctions/${auction._id}/bid`, {
        amount: amountNum,
      });

      toast.success(
        data.extended
          ? '🎉 Highest Bid Placed! Timer extended by 2 mins (anti-sniping).'
          : '🎉 Highest Bid Placed Successfully!'
      );
      setBidAmount('');
      if (onBidSuccess) onBidSuccess(data.auction);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-canvas-850 border border-gold-500/30 shadow-luxury-sm">
      <div className="flex items-center justify-between pb-3 border-b border-ivory-200 dark:border-canvas-800">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-canvas-500 dark:text-canvas-400">
            Current Highest Bid
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif text-2xl font-bold text-canvas-900 dark:text-ivory-50">
              ${currentBid.toLocaleString()}
            </span>
            <span className="text-xs text-canvas-500">USD</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-canvas-500 dark:text-canvas-400">
            Minimum Next Bid
          </span>
          <div className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
            ${minNextBid.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Quick Bid Chips */}
      <div className="py-3">
        <label className="text-[11px] font-semibold text-canvas-700 dark:text-ivory-300 block mb-1.5">
          Quick Bid Increments
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[minIncrement, minIncrement * 2, minIncrement * 4, minIncrement * 10].map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => handleQuickAdd(inc)}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-ivory-100 dark:bg-canvas-800 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-white transition-all text-canvas-700 dark:text-ivory-200 active:scale-95"
            >
              +${inc}
            </button>
          ))}
        </div>
      </div>

      {/* Bid Input Form */}
      <form onSubmit={handlePlaceBid} className="space-y-3 pt-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-canvas-400">
            <FiDollarSign className="w-4 h-4" />
          </div>
          <input
            type="number"
            min={minNextBid}
            step="1"
            placeholder={`Enter $${minNextBid.toLocaleString()} or more`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ivory-300 dark:border-canvas-700 bg-white dark:bg-canvas-900 text-canvas-900 dark:text-ivory-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
        >
          <FiZap className="w-4 h-4" />
          <span>{submitting ? 'Confirming Bid...' : 'Place Official Bid'}</span>
        </button>
      </form>

      {/* Anti-sniping assurance notice */}
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-canvas-500 dark:text-ivory-400">
        <FiAlertCircle className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
        <span>Anti-sniping active: Bids placed in final 2 minutes extend the clock.</span>
      </div>
    </div>
  );
}
