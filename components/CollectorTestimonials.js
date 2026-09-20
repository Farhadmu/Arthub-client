'use client';
import { FiStar, FiCheck, FiAward, FiShield } from 'react-icons/fi';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The 3D Room simulation allowed me to check the exact scale in our duplex living room before acquiring. The physical oil impasto texture exceeded even the digital preview.",
    author: "Sir Julian Hawthorne",
    title: "Contemporary Collector, London",
    artworkAcquired: "Symphony in Ochre",
    stars: 5,
    verifiedCollector: true,
  },
  {
    id: 2,
    quote: "Receiving the cryptographic Certificate of Authenticity with the holographic 3D seal was stunning. ArtHub has set the international standard for independent art marketplace provenance.",
    author: "Camilla Vance-Moreau",
    title: "Interior Architecture Director, Paris",
    artworkAcquired: "The Golden Alchemist",
    stars: 5,
    verifiedCollector: true,
  },
  {
    id: 3,
    quote: "The live auction anti-sniping extension gave everyone a fair chance without bots winning at the last second. Truly an exhilarating and transparent bidding arena.",
    author: "Dr. Kenji Takahashi",
    title: "Digital Art Patron, Tokyo",
    artworkAcquired: "Obsidian Helix",
    stars: 5,
    verifiedCollector: true,
  },
];

export default function CollectorTestimonials() {
  return (
    <section className="py-20 bg-ivory-50 dark:bg-canvas-950 border-t border-ivory-200 dark:border-canvas-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
            <FiShield />
            <span>Verified Collector Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
            Trusted by Connoisseurs <span className="text-brand-500 italic font-serif">Worldwide</span>
          </h2>
          <p className="text-xs sm:text-sm text-canvas-600 dark:text-ivory-300 mt-2">
            Read firsthand accounts from private collectors, gallerists, and interior architects.
          </p>
        </div>

        {/* 3-Column Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="card p-8 flex flex-col justify-between space-y-6 relative hover:shadow-luxury transition-all border border-ivory-200 dark:border-canvas-800"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(t.stars)].map((_, i) => (
                    <FiStar key={i} size={15} className="fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-canvas-700 dark:text-ivory-200 italic font-serif leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-ivory-200 dark:border-canvas-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold font-display text-canvas-950 dark:text-white">
                    {t.author}
                  </h4>
                  {t.verifiedCollector && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      <FiCheck size={12} />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-canvas-500 dark:text-ivory-400">
                  {t.title}
                </p>
                <div className="pt-2 text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                  Acquired: <span className="underline">{t.artworkAcquired}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Trust Stat Bar */}
        <div className="mt-14 p-6 rounded-2xl bg-white dark:bg-canvas-900 border border-ivory-200 dark:border-canvas-800 flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <span className="block text-2xl font-bold font-display text-canvas-950 dark:text-white">100%</span>
            <span className="text-xs text-canvas-500 dark:text-ivory-400">Archival Guarantee</span>
          </div>
          <div className="h-8 w-px bg-ivory-200 dark:bg-canvas-800 hidden sm:block" />
          <div>
            <span className="block text-2xl font-bold font-display text-canvas-950 dark:text-white">SHA-256</span>
            <span className="text-xs text-canvas-500 dark:text-ivory-400">Cryptographic COA</span>
          </div>
          <div className="h-8 w-px bg-ivory-200 dark:bg-canvas-800 hidden sm:block" />
          <div>
            <span className="block text-2xl font-bold font-display text-canvas-950 dark:text-white">Zero Fees</span>
            <span className="text-xs text-canvas-500 dark:text-ivory-400">Hidden Gallery Markups</span>
          </div>
          <div className="h-8 w-px bg-ivory-200 dark:bg-canvas-800 hidden sm:block" />
          <div>
            <span className="block text-2xl font-bold font-display text-canvas-950 dark:text-white">Global</span>
            <span className="text-xs text-canvas-500 dark:text-ivory-400">Insured Art Courier</span>
          </div>
        </div>

      </div>
    </section>
  );
}
