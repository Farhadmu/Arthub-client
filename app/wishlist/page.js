'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import SparklesIcon from '@/components/SparklesIcon';
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { openCurator } = useUI();
  const router = useRouter();
  const [purchasingId, setPurchasingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); }
  }, [user, authLoading, router]);

  const handleBuyNow = async (artworkId) => {
    setPurchasingId(artworkId);
    try {
      const { data } = await api.post('/transactions/create-purchase-session', { artworkId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
      setPurchasingId(null);
    }
  };

  if (authLoading || !user || wishlistLoading) return <Loading fullScreen text="Loading Saved Collection..." />;

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-xs">
              <FiHeart size={22} className="fill-current" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
                My Saved Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-canvas-500 dark:text-ivory-400 mt-0.5">
                {wishlist.length} artworks in your curated collection
              </p>
            </div>
          </div>

          <button
            onClick={openCurator}
            className="btn-ai text-xs py-2.5 px-4 shadow-sm self-start sm:self-auto"
          >
            <SparklesIcon />
            <span>Curate Similar with AI</span>
          </button>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((artwork, i) => (
              <motion.div
                key={artwork._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card flex flex-col justify-between group bg-white dark:bg-canvas-850 shadow-luxury-sm"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-ivory-200 dark:bg-canvas-800">
                    <Link href={`/artworks/${artwork._id}`}>
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    {artwork.isSold && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                        Sold
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-canvas-950/70 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                      {artwork.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <Link href={`/artworks/${artwork._id}`}>
                      <h3 className="font-display font-semibold text-base text-canvas-900 dark:text-ivory-100 hover:text-brand-500 transition-colors truncate">
                        {artwork.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-canvas-500 dark:text-ivory-400 truncate">
                      by {artwork.artistName || artwork.artist?.name || 'Creator'}
                    </p>
                    <span className="text-lg font-bold font-sans text-brand-600 dark:text-brand-400 block pt-1">
                      ${artwork.price}
                    </span>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-ivory-200 dark:border-canvas-800 mt-2">
                  <button
                    onClick={() => toggleWishlist(artwork)}
                    className="p-2 text-canvas-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  {!artwork.isSold ? (
                    <button
                      onClick={() => handleBuyNow(artwork._id)}
                      disabled={purchasingId === artwork._id}
                      className="btn-primary text-xs py-2 px-3.5 flex-1 justify-center"
                    >
                      <FiShoppingCart size={14} />
                      <span>{purchasingId === artwork._id ? 'Securing...' : 'Buy Now'}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-canvas-400 font-medium py-2">
                      Acquired
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 card p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
              <FiHeart size={32} />
            </div>
            <h3 className="font-display font-bold text-xl text-canvas-900 dark:text-ivory-100">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs sm:text-sm text-canvas-500 dark:text-ivory-400 mt-1 max-w-sm mx-auto">
              Save original artworks while browsing, or ask ArtHub AI to suggest matching pieces for your aesthetic.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/artworks" className="btn-primary text-xs py-3 px-6">
                Browse Gallery Artworks
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
