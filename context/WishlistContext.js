'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
      setWishlistIds(new Set(data.map(item => item._id || item)));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback((artworkId) => {
    if (!artworkId) return false;
    return wishlistIds.has(artworkId.toString());
  }, [wishlistIds]);

  const toggleWishlist = async (artwork) => {
    if (!user) {
      toast.error('Please login to save to your wishlist');
      return false;
    }

    const artworkId = artwork._id || artwork;
    const currentlyIn = wishlistIds.has(artworkId.toString());

    // Optimistic UI update
    const nextSet = new Set(wishlistIds);
    if (currentlyIn) {
      nextSet.delete(artworkId.toString());
      setWishlistIds(nextSet);
      setWishlist(prev => prev.filter(item => (item._id || item) !== artworkId));
    } else {
      nextSet.add(artworkId.toString());
      setWishlistIds(nextSet);
      setWishlist(prev => [artwork, ...prev]);
    }

    try {
      if (currentlyIn) {
        await api.delete(`/wishlist/${artworkId}`);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${artworkId}`);
        toast.success('Added to your wishlist! 💖');
      }
      return !currentlyIn;
    } catch (error) {
      // Rollback on error
      setWishlistIds(wishlistIds);
      toast.error('Failed to update wishlist');
      fetchWishlist();
      return currentlyIn;
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isWishlisted,
      toggleWishlist,
      fetchWishlist,
      count: wishlistIds.size,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
