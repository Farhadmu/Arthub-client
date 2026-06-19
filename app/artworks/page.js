'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import { ArtworkCardSkeleton } from '@/components/Loading';
import api from '@/lib/axios';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function BrowseArtworksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner w-12 h-12"></div></div>}>
      <BrowseArtworksContent />
    </Suspense>
  );
}

function BrowseArtworksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const categories = ['All', 'Painting', 'Digital', 'Sculpture', 'Photography', 'Illustration', 'Mixed Media', 'Other'];

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category !== 'All') params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        params.append('sort', filters.sort);
        params.append('page', filters.page);
        params.append('limit', '10');

        const { data } = await api.get(`/artworks?${params.toString()}`);
        setArtworks(data.artworks);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2 text-brown-800 dark:text-cream-100">Browse Artworks</h1>
          <p className="text-brown-500 dark:text-cream-400">
            Discover unique pieces from talented artists
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-brown-700 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400" />
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field"
              />
            </div>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {!loading && (
          <p className="text-brown-500 dark:text-cream-400 mb-6">
            Showing {artworks.length} of {pagination.total} artworks
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(10)].map((_, i) => (
              <ArtworkCardSkeleton key={i} />
            ))}
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiFilter size={64} className="mx-auto text-brown-400 dark:text-cream-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-brown-800 dark:text-cream-100">No artworks found</h3>
            <p className="text-brown-500 dark:text-cream-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-12">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-brown-700 hover:bg-cream-200 dark:hover:bg-brown-600 text-brown-700 dark:text-cream-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}