'use client';

import { useState } from 'react';
import HolographicSeal from './HolographicSeal';
import SparklesIcon from './SparklesIcon';
import { FiX, FiPrinter, FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi';

export default function CertificateModal({ isOpen, onClose, certificate, artwork }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const hash = certificate?.verificationHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const artworkTitle = artwork?.title || certificate?.artworkTitle || 'Masterpiece';
  const artistName = artwork?.artistName || certificate?.artistName || 'Elena Rostova';
  const buyerName = certificate?.buyerName || 'Verified Collector';
  const medium = artwork?.category || certificate?.medium || 'Digital Fine Art Master';
  const editionNumber = certificate?.editionNumber || '1/1 Original Master';
  const year = certificate?.metadata?.yearCreated || new Date().getFullYear();

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-ivory-50 dark:bg-canvas-900 border border-gold-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden my-8">
        {/* Background luxury watermark */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-canvas-100 dark:bg-canvas-800 text-canvas-500 hover:text-canvas-900 dark:hover:text-white transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Certificate Card Container */}
        <div className="border-4 border-double border-gold-500/50 p-6 sm:p-8 rounded-2xl relative bg-white/60 dark:bg-canvas-950/70 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center pb-6 border-b border-gold-500/30">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <SparklesIcon className="w-3.5 h-3.5" />
              Cryptographic Provenance
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-canvas-950 dark:text-ivory-50 tracking-tight">
              Certificate of Authenticity
            </h2>
            <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-1 uppercase tracking-widest">
              ArtHub Global Archive · Registry of Masterworks
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-6 space-y-4 text-center">
            <p className="text-xs italic text-canvas-500 dark:text-ivory-400">
              This document serves as permanent provenance and legal certification that
            </p>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-600 dark:text-brand-400">
              "{artworkTitle}"
            </h3>
            <p className="text-sm text-canvas-700 dark:text-ivory-200">
              Created by <strong className="font-serif text-canvas-900 dark:text-ivory-100">{artistName}</strong> ({year})
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 text-left border-y border-ivory-200 dark:border-canvas-800 text-xs">
              <div>
                <span className="text-canvas-400 block text-[10px] uppercase">Medium</span>
                <span className="font-medium text-canvas-800 dark:text-ivory-200">{medium}</span>
              </div>
              <div>
                <span className="text-canvas-400 block text-[10px] uppercase">Edition</span>
                <span className="font-medium text-canvas-800 dark:text-ivory-200">{editionNumber}</span>
              </div>
              <div>
                <span className="text-canvas-400 block text-[10px] uppercase">Issued To</span>
                <span className="font-medium text-canvas-800 dark:text-ivory-200">{buyerName}</span>
              </div>
            </div>

            {/* Holographic Seal & Verification QR representation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="text-left space-y-1.5 flex-1">
                <span className="text-[10px] text-canvas-400 uppercase tracking-wider block">
                  SHA-256 Verification Hash
                </span>
                <div className="flex items-center gap-2 p-2 bg-canvas-100 dark:bg-canvas-900 rounded-lg border border-ivory-300 dark:border-canvas-800 text-[10px] font-mono text-canvas-700 dark:text-ivory-300 break-all">
                  <span className="truncate">{hash}</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 rounded hover:bg-canvas-200 dark:hover:bg-canvas-750 flex-shrink-0"
                    title="Copy verification hash"
                  >
                    {copied ? <FiCheck className="w-3.5 h-3.5 text-green-500" /> : <FiCopy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <a
                  href={`/verify/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-gold-600 dark:text-gold-400 hover:underline pt-1"
                >
                  <span>Public Registry Link</span>
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* 3D Interactive Holographic Seal */}
              <div className="flex-shrink-0">
                <HolographicSeal size="md" editionNumber={editionNumber} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="btn-secondary text-sm py-2.5 px-4"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
          <button
            onClick={onClose}
            className="btn-primary text-sm py-2.5 px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
