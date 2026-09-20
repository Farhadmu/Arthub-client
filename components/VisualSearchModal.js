'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiImage, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useUI } from '@/context/UIContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function VisualSearchModal() {
  const { isVisualSearchOpen, closeVisualSearch } = useUI();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      runVisualSearch(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const runVisualSearch = async (dataUrl) => {
    setLoading(true);
    setResults([]);
    try {
      const { data } = await api.post('/ai/visual-search', {
        imageInput: dataUrl,
        limit: 6
      });
      setResults(data);
      if (data.length === 0) {
        toast('No close visual matches found, try another image', { icon: '🔍' });
      }
    } catch (error) {
      toast.error('Visual search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isVisualSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVisualSearch}
            className="fixed inset-0 bg-canvas-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-white dark:bg-canvas-900 rounded-3xl border border-ivory-300 dark:border-canvas-700 shadow-luxury overflow-hidden z-50 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-ivory-200 dark:border-canvas-750 flex items-center justify-between bg-ivory-50 dark:bg-canvas-850">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/25">
                  <FiImage size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100">
                    AI Visual Search
                  </h3>
                  <p className="text-xs text-canvas-500 dark:text-ivory-400">
                    Find visually similar artworks across color, style, and composition
                  </p>
                </div>
              </div>
              <button
                onClick={closeVisualSearch}
                className="p-2 text-canvas-400 hover:text-canvas-700 dark:hover:text-ivory-200 rounded-xl hover:bg-ivory-200 dark:hover:bg-canvas-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {!previewUrl ? (
                /* Dropzone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                    isDragging
                      ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                      : 'border-ivory-300 dark:border-canvas-700 hover:border-brand-400 bg-ivory-50/50 dark:bg-canvas-850/50'
                  }`}
                  onClick={() => document.getElementById('visual-file-input')?.click()}
                >
                  <input
                    id="visual-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
                    <FiUploadCloud size={32} />
                  </div>
                  <h4 className="font-display font-semibold text-base text-canvas-900 dark:text-ivory-100 mb-1">
                    Drop an artwork or photo here
                  </h4>
                  <p className="text-xs text-canvas-500 dark:text-ivory-400 mb-4 max-w-sm">
                    Drag and drop or click to upload JPEG, PNG, or WEBP. Our AI will analyze color palettes and composition to discover matching original pieces.
                  </p>
                  <span className="btn-secondary text-xs py-2 px-4 pointer-events-none">
                    Select Image File
                  </span>
                </div>
              ) : (
                /* Preview & Matches */
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3.5 bg-ivory-100 dark:bg-canvas-800 rounded-2xl border border-ivory-200 dark:border-canvas-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={previewUrl}
                        alt="Visual query"
                        className="w-14 h-14 object-cover rounded-xl border border-ivory-300 dark:border-canvas-600"
                      />
                      <div>
                        <span className="text-xs font-semibold text-canvas-800 dark:text-ivory-200 block">
                          Target Visual Query
                        </span>
                        <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                          {loading ? 'Analyzing features...' : 'Feature extraction complete'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs text-canvas-500 hover:text-brand-500 dark:text-ivory-400 underline font-medium px-2 py-1"
                    >
                      Upload Different Image
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto" />
                      <p className="text-sm font-medium text-canvas-700 dark:text-ivory-200">
                        ArtHub AI is comparing color palettes, style, and composition...
                      </p>
                    </div>
                  ) : results.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-display font-semibold text-sm text-canvas-800 dark:text-ivory-200">
                          Visually Similar Artworks ({results.length})
                        </h4>
                        <span className="text-xs text-canvas-500 dark:text-ivory-400">
                          Sorted by visual resemblance
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {results.map(({ artwork, similarityPercentage, matchedAttributes }) => (
                          <Link
                            key={artwork._id}
                            href={`/artworks/${artwork._id}`}
                            onClick={closeVisualSearch}
                            className="group p-2.5 bg-ivory-50 dark:bg-canvas-800 rounded-2xl border border-ivory-200 dark:border-canvas-700 hover:border-brand-500 transition-all flex gap-3 items-center"
                          >
                            <img
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-20 h-20 object-cover rounded-xl group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                  {similarityPercentage}% Match
                                </span>
                                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                                  ${artwork.price}
                                </span>
                              </div>
                              <h5 className="font-display font-semibold text-xs text-canvas-900 dark:text-ivory-100 truncate group-hover:text-brand-500">
                                {artwork.title}
                              </h5>
                              <p className="text-[11px] text-canvas-500 dark:text-ivory-400 truncate">
                                by {artwork.artistName || artwork.artist?.name}
                              </p>

                              {/* Dominant color swatches */}
                              {matchedAttributes?.dominantColors?.length > 0 && (
                                <div className="mt-1.5 flex gap-1">
                                  {matchedAttributes.dominantColors.map((color, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs inline-block"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-canvas-500 dark:text-ivory-400 text-sm">
                      No visually similar artworks matched yet. Try another piece with distinct colors.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
