'use client';
import { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import ArtworkCard from '@/components/ArtworkCard';
import toast from 'react-hot-toast';
import { FiImage, FiArrowLeft } from 'react-icons/fi';

export default function ArtistProfilePage() {
  const { id } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistArtworks = async () => {
      try {
        const { data } = await api.get(`/artworks/artist/${id}`);
        setArtworks(data);
      } catch (error) {
        toast.error('Failed to load artist artworks');
      } finally {
        setLoading(false);
      }
    };
    fetchArtistArtworks();
  }, [id]);

  if (loading) return <Loading fullScreen />;

  const artistName = artworks[0]?.artistName || 'Artist';
  const artistAvatar = artworks[0]?.artist?.avatar;

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/artworks"
          className="inline-flex items-center space-x-2 text-brown-500 dark:text-cream-400 hover:text-primary-600 mb-6 text-sm font-medium"
        >
          <FiArrowLeft />
          <span>Back to Browse</span>
        </Link>

        {/* Artist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-brown-700 rounded-xl shadow-lg p-8 mb-8 flex items-center space-x-6"
        >
          {artistAvatar ? (
            <img
              src={artistAvatar}
              alt={artistName}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-3xl font-bold">
              {artistName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-display font-bold text-brown-800 dark:text-cream-100">
              {artistName}
            </h1>
            <p className="text-brown-500 dark:text-cream-400 mt-1">
              {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} on ArtHub
            </p>
          </div>
        </motion.div>

        {/* Artworks Grid */}
        {artworks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((artwork, i) => (
              <motion.div
                key={artwork._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-brown-700 rounded-xl shadow-lg">
            <FiImage size={64} className="mx-auto text-brown-200 dark:text-brown-600 mb-4" />
            <h2 className="text-2xl font-semibold text-brown-700 dark:text-cream-200 mb-2">
              No artworks yet
            </h2>
            <p className="text-brown-500 dark:text-cream-400">
              This artist hasn't published any artworks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
