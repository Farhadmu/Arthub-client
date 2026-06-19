'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function ArtworkCard({ artwork }) {
  const { user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlist();
    }
  }, [user, artwork]);

  const checkWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      const isWishlisted = data.some(item => item._id === artwork._id);
      setInWishlist(isWishlisted);
    } catch (error) {
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${artwork._id}`);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${artwork._id}`);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card group cursor-pointer relative">
      <Link href={`/artworks/${artwork._id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {artwork.category}
          </div>

          {artwork.isSold && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Sold
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white text-brown-800 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <FiEye />
                <span>View Details</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {user && (
        <button
          onClick={toggleWishlist}
          disabled={loading}
          className={`absolute top-4 ${artwork.isSold ? 'left-20' : 'left-4'} p-2 rounded-full shadow-lg transition-all ${
            inWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-brown-700 text-brown-600 dark:text-cream-300 hover:bg-red-50 dark:hover:bg-red-900'
          }`}
        >
          <FiHeart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      )}

      <div className="p-4">
        <Link href={`/artworks/${artwork._id}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-brown-800 dark:text-cream-100 group-hover:text-primary-600 transition-colors">
            {artwork.title}
          </h3>
        </Link>
        <p className="text-brown-500 dark:text-cream-400 text-sm mb-2">
          by {artwork.artistName || artwork.artist?.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">${artwork.price}</span>
          {!artwork.isSold && (
            <Link 
              href={`/artworks/${artwork._id}`}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}