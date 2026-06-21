'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);

  useEffect(() => {
    if (authLoading) return; // wait until auth state is resolved
    if (!user) { router.push('/login'); return; }
    fetchWishlist();
  }, [user, authLoading]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (artworkId) => {
    setRemovingId(artworkId);
    try {
      await api.delete(`/wishlist/${artworkId}`);
      setWishlist(wishlist.filter((item) => item._id !== artworkId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    } finally {
      setRemovingId(null);
    }
  };

  const handleBuyNow = async (artworkId) => {
    setPurchasingId(artworkId);
    try {
      const { data } = await api.post('/transactions/create-purchase-session', { artworkId });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
      setPurchasingId(null);
    }
  };

  if (authLoading || !user || loading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <FiHeart className="text-primary-600" size={32} />
          <h1 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100">
            My Wishlist
          </h1>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((artwork, i) => (
              <motion.div
                key={artwork._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-brown-700 rounded-xl shadow-lg overflow-hidden group"
              >
                <Link href={`/artworks/${artwork._id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {artwork.isSold && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Sold
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {artwork.category}
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/artworks/${artwork._id}`}>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-brown-800 dark:text-cream-100 hover:text-primary-600 transition-colors">
                      {artwork.title}
                    </h3>
                  </Link>
                  <p className="text-brown-500 dark:text-cream-400 text-sm mb-3">
                    by {artwork.artistName || artwork.artist?.name}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary-600">${artwork.price}</span>
                  </div>

                  <div className="flex space-x-2">
                    {!artwork.isSold ? (
                      <button
                        onClick={() => handleBuyNow(artwork._id)}
                        disabled={purchasingId === artwork._id}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2 text-sm disabled:opacity-50"
                      >
                        <FiShoppingCart size={16} />
                        <span>{purchasingId === artwork._id ? 'Redirecting...' : 'Add to Cart'}</span>
                      </button>
                    ) : (
                      <div className="flex-1 bg-gray-100 dark:bg-brown-600 text-gray-500 dark:text-cream-400 py-2 rounded-lg text-center text-sm font-medium">
                        Sold Out
                      </div>
                    )}
                    <button
                      onClick={() => handleRemove(artwork._id)}
                      disabled={removingId === artwork._id}
                      className="p-2 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-brown-700 rounded-xl shadow-lg">
            <FiHeart size={64} className="mx-auto text-brown-200 dark:text-brown-600 mb-4" />
            <h2 className="text-2xl font-semibold text-brown-700 dark:text-cream-200 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-brown-500 dark:text-cream-400 mb-6">
              Save artworks you love by clicking the heart icon
            </p>
            <Link href="/artworks" className="btn-primary inline-block px-8 py-3">
              Browse Artworks
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}












