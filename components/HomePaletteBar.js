'use client';
import Link from 'next/link';
import { FiDisc, FiArrowRight } from 'react-icons/fi';

const CURATED_PALETTES = [
  { name: 'Tuscan Ochre', hex: '#D97706', label: 'Warm & Earthy' },
  { name: 'Royal Azure', hex: '#0070F3', label: 'Contemplative & Deep' },
  { name: 'Emerald Forest', hex: '#059669', label: 'Organic & Restorative' },
  { name: 'Crimson Velvet', hex: '#DC2626', label: 'Bold & Passionate' },
  { name: 'Midnight Obsidian', hex: '#111827', label: 'Minimalist & Monochromatic' },
  { name: 'Amethyst Violet', hex: '#7C3AED', label: 'Mystic & Surreal' },
];

export default function HomePaletteBar() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-canvas-900/70 backdrop-blur-md border border-ivory-300 dark:border-canvas-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Label */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <FiDisc size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-canvas-900 dark:text-white">
              Interior Color Matcher
            </h4>
            <p className="text-[11px] text-canvas-500 dark:text-ivory-400">
              Browse original art harmonized to your room's wall palette
            </p>
          </div>
        </div>

        {/* Swatches */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CURATED_PALETTES.map((p) => (
            <Link
              key={p.hex}
              href={`/artworks?color=${encodeURIComponent(p.hex)}`}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ivory-100 dark:bg-canvas-800 border border-ivory-200 dark:border-canvas-750 hover:border-brand-500 transition-all text-xs"
            >
              <span
                className="w-3.5 h-3.5 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                style={{ backgroundColor: p.hex }}
              />
              <span className="font-semibold text-canvas-800 dark:text-ivory-200 text-[11px]">
                {p.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Explore all with color wheel */}
        <Link
          href="/artworks"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 flex-shrink-0"
        >
          <span>All Palettes</span>
          <FiArrowRight size={13} />
        </Link>

      </div>
    </div>
  );
}
