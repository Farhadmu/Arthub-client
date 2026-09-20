'use client';

import { useState } from 'react';
import SparklesIcon from './SparklesIcon';

export default function PaletteColorFilter({ selectedColor, onSelectColor, onReset }) {
  const [customColor, setCustomColor] = useState('#E07A5F');

  // Curated Luxury Architectural & Interior Palettes
  const presetPalettes = [
    { name: 'Terracotta Hearth', hex: '#E07A5F' },
    { name: 'Florentine Gold', hex: '#D4AF37' },
    { name: 'Midnight Obsidian', hex: '#171B24' },
    { name: 'Nordic Sage', hex: '#78866B' },
    { name: 'Aegean Cobalt', hex: '#1A2238' },
    { name: 'Raw Linen', hex: '#DED7C8' },
    { name: 'Velvet Plum', hex: '#582C4D' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-gold-500/10 text-gold-500">
            <SparklesIcon className="w-4 h-4" />
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-canvas-900 dark:text-ivory-100">
            Interior Palette Matcher
          </h4>
        </div>

        {selectedColor && (
          <button
            onClick={onReset}
            className="text-[11px] text-brand-500 hover:underline font-medium"
          >
            Clear Palette
          </button>
        )}
      </div>

      <p className="text-[11px] text-canvas-500 dark:text-ivory-400">
        Filter artworks harmonized with your home interior tones:
      </p>

      {/* Swatches */}
      <div className="flex items-center gap-2 flex-wrap">
        {presetPalettes.map((p) => {
          const isSelected = selectedColor?.toUpperCase() === p.hex.toUpperCase();
          return (
            <button
              key={p.hex}
              onClick={() => onSelectColor(p.hex)}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 shadow-sm scale-105'
                  : 'border-ivory-300 dark:border-canvas-700 hover:border-canvas-400 text-canvas-700 dark:text-ivory-300'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/20 shadow-xs flex-shrink-0"
                style={{ backgroundColor: p.hex }}
              />
              <span className="text-[11px]">{p.name}</span>
            </button>
          );
        })}

        {/* Custom Hex Picker */}
        <div className="flex items-center gap-1 pl-1 border-l border-ivory-300 dark:border-canvas-700">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onSelectColor(e.target.value);
            }}
            className="w-6 h-6 rounded-full cursor-pointer border-0 p-0 shadow-sm"
            title="Custom Hex Picker"
          />
          <span className="text-[10px] font-mono text-canvas-500 uppercase">
            Custom
          </span>
        </div>
      </div>
    </div>
  );
}
