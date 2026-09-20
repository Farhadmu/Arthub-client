'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import { ArtworkCardSkeleton } from '@/components/Loading';
import { useUI } from '@/context/UIContext';
import api from '@/lib/axios';
import SparklesIcon from '@/components/SparklesIcon';
import {
  FiSearch, FiFilter, FiChevronLeft, FiChevronRight,
  FiImage, FiX, FiRefreshCw
} from 'react-icons/fi';

const CATEGORIES = ['All', 'Painting', 'Digital', 'Sculpture', 'Photography', 'Illustration', 'Mixed Media', 'Other'];
const STYLES = ['All', 'Abstract Expressionism', 'Contemporary Digital', 'Minimalist', 'Surrealism', 'Neo-Impressionism', 'Cyberpunk', 'Concept Art'];

export default function BrowseArtworksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner w-12 h-12" /></div>}>
      <BrowseArtworksContent />
    </Suspense>
  );
}

function BrowseArtworksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openVisualSearch, openCurator } = useUI();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  const [isSmartSearch, setIsSmartSearch] = useState(false);
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [smartFiltersActive, setSmartFiltersActive] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    style: 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category !== 'All') params.append('category', filters.category);
        if (filters.style !== 'All') params.append('style', filters.style);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        params.append('sort', filters.sort);
        params.append('page', filters.page);
        params.append('limit', '12');

        const { data } = await api.get(`/artworks?${params.toString()}`);
        setArtworks(data.artworks || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    setSmartFiltersActive(null);
  };

  const handleSmartSearchSubmit = async (e) => {
    e.preventDefault();
    if (!smartSearchQuery.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.get(`/ai/smart-search?q=${encodeURIComponent(smartSearchQuery.trim())}`);
      setArtworks(data.artworks || []);
      setPagination({ page: 1, pages: 1, total: data.total });
      setSmartFiltersActive(data.parsedFilters);
    } catch (error) {
      console.error('Smart search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAllFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      style: 'All',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    });
    setSmartSearchQuery('');
    setSmartFiltersActive(null);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Mode Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-1 block">
              Gallery Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-canvas-950 dark:text-white">
              Browse Artworks
            </h1>
            <p className="text-sm text-canvas-500 dark:text-ivory-400 mt-1">
              Explore {pagination.total} original pieces curated from global artists
            </p>
          </div>

          {/* Quick AI Trigger buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSmartSearch(!isSmartSearch)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSmartSearch
                  ? 'bg-brand-500 text-white border-brand-500 shadow-glow'
                  : 'bg-white dark:bg-canvas-850 text-canvas-700 dark:text-ivory-200 border-ivory-300 dark:border-canvas-700'
              }`}
            >
              <SparklesIcon />
              <span>Natural Language Search</span>
            </button>

            <button
              onClick={openVisualSearch}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-canvas-850 text-canvas-700 dark:text-ivory-200 border border-ivory-300 dark:border-canvas-700 hover:border-brand-500 transition-all"
            >
              <FiImage className="text-brand-500" />
              <span>Search by Photo</span>
            </button>
          </div>
        </div>

        {/* AI Smart Search Input (If Active) */}
        {isSmartSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-500/10 via-ivory-100 dark:via-canvas-850 to-gold-500/10 border border-brand-500/30"
          >
            <form onSubmit={handleSmartSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <SparklesIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                <input
                  type="text"
                  value={smartSearchQuery}
                  onChange={(e) => setSmartSearchQuery(e.target.value)}
                  placeholder="E.g., 'Peaceful abstract blue paintings under $200' or 'Atmospheric landscape photography'"
                  className="input-field pl-10 text-sm"
                />
              </div>
              <button type="submit" className="btn-ai text-xs py-3 px-6 whitespace-nowrap">
                Analyze & Search
              </button>
            </form>

            {smartFiltersActive && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-canvas-700 dark:text-ivory-300">AI Interpreted Filters:</span>
                {smartFiltersActive.maxPrice && (
                  <span className="bg-white dark:bg-canvas-700 px-2.5 py-1 rounded-lg border border-ivory-300 dark:border-canvas-600">
                    Max: ${smartFiltersActive.maxPrice}
                  </span>
                )}
                {smartFiltersActive.category && (
                  <span className="bg-white dark:bg-canvas-700 px-2.5 py-1 rounded-lg border border-ivory-300 dark:border-canvas-600">
                    Category: {smartFiltersActive.category}
                  </span>
                )}
                {smartFiltersActive.styles?.map(s => (
                  <span key={s} className="bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-lg">
                    Style: {s}
                  </span>
                ))}
                {smartFiltersActive.moods?.map(m => (
                  <span key={m} className="bg-gold-500/10 text-gold-600 dark:text-gold-400 px-2.5 py-1 rounded-lg">
                    Mood: {m}
                  </span>
                ))}
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1 ml-2 font-medium"
                >
                  <FiX />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Standard Filter & Search Controls */}
        <div className="bg-white dark:bg-canvas-850 rounded-2xl border border-ivory-200 dark:border-canvas-750 p-5 mb-8 shadow-luxury-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Keyword Search */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-canvas-400" />
              <input
                type="text"
                placeholder="Search title, artist, or tags..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10 text-xs sm:text-sm"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field text-xs sm:text-sm cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Mediums' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field text-xs sm:text-sm"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field text-xs sm:text-sm"
              />
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field text-xs sm:text-sm cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular (Views)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Style Filter Chips */}
          <div className="mt-4 pt-4 border-t border-ivory-200 dark:border-canvas-750 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-canvas-500 dark:text-ivory-400 whitespace-nowrap flex items-center gap-1 mr-1">
              <FiFilter size={13} />
              <span>Style:</span>
            </span>
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => handleFilterChange('style', style)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  filters.style === style
                    ? 'bg-brand-500 text-white font-medium shadow-xs'
                    : 'bg-ivory-100 dark:bg-canvas-800 text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200 dark:hover:bg-canvas-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ArtworkCardSkeleton key={i} />
            ))}
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white dark:bg-canvas-850 rounded-3xl border border-ivory-200 dark:border-canvas-750 p-8 shadow-luxury-sm">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
              <FiSearch size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-canvas-900 dark:text-ivory-100">
              No artworks matched your criteria
            </h3>
            <p className="text-xs sm:text-sm text-canvas-500 dark:text-ivory-400 mt-1 max-w-md mx-auto">
              Try adjusting your price range, clearing style filters, or ask ArtHub AI to suggest alternative pieces.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={resetAllFilters} className="btn-secondary text-xs py-2.5 px-4">
                <FiRefreshCw size={13} />
                <span>Reset All Filters</span>
              </button>
              <button onClick={openCurator} className="btn-ai text-xs py-2.5 px-4">
                <SparklesIcon size={13} />
                <span>Ask ArtHub AI Curator</span>
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              className="p-2.5 rounded-xl border border-ivory-300 dark:border-canvas-700 bg-white dark:bg-canvas-850 text-canvas-700 dark:text-ivory-200 disabled:opacity-40 hover:bg-ivory-100 transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            <span className="text-xs font-semibold text-canvas-600 dark:text-ivory-300 px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= pagination.pages}
              className="p-2.5 rounded-xl border border-ivory-300 dark:border-canvas-700 bg-white dark:bg-canvas-850 text-canvas-700 dark:text-ivory-200 disabled:opacity-40 hover:bg-ivory-100 transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}