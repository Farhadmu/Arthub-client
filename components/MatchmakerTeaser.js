'use client';
import { motion } from 'framer-motion';
import { FiHeart, FiX, FiZap, FiArrowRight } from 'react-icons/fi';

export default function MatchmakerTeaser({ onOpenMatchmaker }) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-canvas-950 via-canvas-900 to-brand-950 text-white p-8 sm:p-12 border border-brand-500/30 shadow-luxury relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold uppercase tracking-widest">
              <FiZap />
              <span>Aesthetic Instinct Discovery</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold leading-tight">
              Swipe. Match. <br />
              <span className="text-brand-400 italic font-serif">Collect.</span>
            </h2>

            <p className="text-sm sm:text-base text-ivory-300 max-w-xl leading-relaxed">
              Don't know the exact art terminology? Let your subconscious guide you. 
              Swipe through our verified masterworks to train your personal AI recommendation vector in seconds.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenMatchmaker}
                className="btn-primary py-3.5 px-8 text-sm font-bold shadow-glow"
              >
                <span>Launch Art Matchmaker</span>
                <FiArrowRight />
              </button>

              <span className="text-xs text-ivory-400 font-medium">
                No sign-up required to test
              </span>
            </div>
          </div>

          {/* Right Card Stack Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center py-4">
            <div className="relative w-64 sm:w-72 h-80">
              
              {/* Back card 2 */}
              <div className="absolute inset-0 rounded-2xl bg-canvas-800/80 border border-white/10 rotate-6 translate-x-4 -translate-y-2 opacity-60 shadow-lg" />
              
              {/* Back card 1 */}
              <div className="absolute inset-0 rounded-2xl bg-canvas-800 border border-white/15 -rotate-3 -translate-x-2 -translate-y-1 opacity-80 shadow-xl" />

              {/* Front active card */}
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-brand-500/50 bg-canvas-900 shadow-2xl flex flex-col justify-between p-3">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&q=80"
                    alt="Matchmaker Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500/90 text-white p-1.5 rounded-full shadow-md">
                    <FiHeart size={14} className="fill-current" />
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">Ethereal Horizons</h4>
                    <span className="text-[11px] font-bold text-gold-400">$340</span>
                  </div>
                  <p className="text-[10px] text-ivory-400">by Elena Rostova • Surrealism</p>
                </div>

                {/* Simulated action buttons */}
                <div className="flex items-center justify-center gap-4 pt-1 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <FiX size={14} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <FiHeart size={14} className="fill-current" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
