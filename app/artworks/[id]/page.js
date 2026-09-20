'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import Loading from '@/components/Loading';
import ArtworkCard from '@/components/ArtworkCard';
import RoomPreviewModal from '@/components/RoomPreviewModal';
import AudioGuidePlayer from '@/components/AudioGuidePlayer';
import CertificateModal from '@/components/CertificateModal';
import SparklesIcon from '@/components/SparklesIcon';
import toast from 'react-hot-toast';
import {
  FiEdit, FiTrash2, FiShoppingCart, FiMessageCircle, FiHeart,
  FiShare2, FiArrowLeft, FiCheck, FiX, FiEye, FiTag, FiMaximize2, FiAward
} from 'react-icons/fi';

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openCurator } = useUI();

  const [artwork, setArtwork] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [similarArtworks, setSimilarArtworks] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [moderationNotice, setModerationNotice] = useState('');

  useEffect(() => {
    const fetchArtworkData = async () => {
      try {
        const [artworkRes, commentsRes, recsRes] = await Promise.all([
          api.get(`/artworks/${id}`),
          api.get(`/comments/artwork/${id}`),
          api.get(`/ai/recommendations?targetArtworkId=${id}&limit=4`).catch(() => ({ data: null })),
        ]);
        setArtwork(artworkRes.data);
        setComments(commentsRes.data || []);
        if (recsRes.data?.becauseYouLiked?.artworks) {
          setSimilarArtworks(recsRes.data.becauseYouLiked.artworks);
        }

        // Increment view count asynchronously
        api.post(`/artworks/${id}/view`).catch(() => {});

        if (user) {
          const purchaseRes = await api.get('/transactions/user/purchases').catch(() => ({ data: [] }));
          const hasPurchased = (purchaseRes.data || []).some(t => t.artwork?._id === id || t.artwork === id);
          setPurchased(hasPurchased);
        }
      } catch (error) {
        toast.error('Artwork could not be loaded');
        router.push('/artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkData();
  }, [id, user, router]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setPurchasing(true);
    try {
      const { data } = await api.post('/transactions/create-purchase-session', { artworkId: id });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
      setPurchasing(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentSubmitting(true);
    setModerationNotice('');

    try {
      const { data } = await api.post(`/comments/artwork/${id}`, { comment: newComment.trim() });
      if (data.notice) {
        setModerationNotice(data.notice);
        toast(data.notice, { icon: '🛡️', duration: 6000 });
      } else {
        setComments(prev => [data, ...prev]);
        toast.success('Review posted successfully!');
      }
      setNewComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Artwork link copied to clipboard!');
    }
  };

  if (loading || !artwork) return <Loading fullScreen text="Loading Exhibition Gallery..." />;

  const wishlisted = isWishlisted(artwork._id);
  const artistId = artwork.artist?._id || artwork.artist;
  const isOwner = user && (user._id === artistId || user._id === artwork.artist);

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 text-xs font-semibold text-canvas-500 hover:text-brand-500 dark:text-ivory-400 transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>Back to Collection</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRoomModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gold-500/40 bg-gold-500/10 text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white text-xs font-semibold shadow-sm transition-all"
              title="View on Your Wall in 3D"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>View on Wall</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-ivory-300 dark:border-canvas-700 bg-white dark:bg-canvas-850 text-canvas-600 dark:text-ivory-300 hover:text-brand-500 transition-colors"
              title="Share Artwork"
            >
              <FiShare2 size={16} />
            </button>
            <button
              onClick={() => toggleWishlist(artwork)}
              className={`p-2.5 rounded-xl border transition-all ${
                wishlisted
                  ? 'bg-red-500 text-white border-red-500 shadow-md'
                  : 'bg-white dark:bg-canvas-850 border-ivory-300 dark:border-canvas-700 text-canvas-600 dark:text-ivory-300 hover:text-red-500'
              }`}
              title={wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            >
              <FiHeart size={16} className={wishlisted ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Dual Column Exhibition Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: High-Res Artwork Display */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-canvas-950 border border-ivory-200 dark:border-canvas-800 shadow-luxury group">
              <img
                src={artwork.image}
                alt={artwork.altText || artwork.title}
                className="w-full h-auto max-h-[750px] object-contain mx-auto"
              />
              {artwork.isSold && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Acquired / Sold
                </div>
              )}
            </div>

            {/* Color Palette Swatches */}
            {artwork.colorPalette && artwork.colorPalette.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-750 flex items-center justify-between">
                <span className="text-xs font-semibold text-canvas-500 dark:text-ivory-400">
                  Dominant Color Palette:
                </span>
                <div className="flex gap-2">
                  {artwork.colorPalette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shadow-xs block cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Museum Audio Guide */}
            <div className="pt-2">
              <AudioGuidePlayer
                artworkId={artwork._id}
                artworkTitle={artwork.title}
                artistName={artwork.artistName}
              />
            </div>
          </div>

          {/* Right Column: Information, Artist & Acquisition CTAs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                  {artwork.category}
                </span>
                {artwork.style && (
                  <span className="bg-ivory-200 dark:bg-canvas-800 text-canvas-700 dark:text-ivory-300 px-3 py-1 rounded-full text-xs font-medium">
                    {artwork.style}
                  </span>
                )}
                {artwork.mood && (
                  <span className="bg-gold-500/10 text-gold-600 dark:text-gold-400 px-3 py-1 rounded-full text-xs font-medium">
                    {artwork.mood}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-canvas-950 dark:text-white leading-tight">
                {artwork.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold font-display">
                  {artwork.artistName?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <span className="text-xs text-canvas-400 block">Created by</span>
                  <Link
                    href={artistId ? `/artists/${artistId}` : '#'}
                    className="text-sm font-semibold text-canvas-800 dark:text-ivory-100 hover:text-brand-500 transition-colors"
                  >
                    {artwork.artistName || artwork.artist?.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Price & Acquisition Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-750 shadow-luxury-sm space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-canvas-400 dark:text-canvas-500 uppercase tracking-wider block">Acquisition Price</span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-sans text-brand-600 dark:text-brand-400">
                    ${artwork.price?.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  Authenticity Verified
                </span>
              </div>

              {!artwork.isSold ? (
                <div className="space-y-2.5">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || isOwner}
                    className="btn-primary w-full py-4 text-sm font-semibold shadow-glow justify-center"
                  >
                    <FiShoppingCart size={18} />
                    <span>{purchasing ? 'Initiating Checkout...' : isOwner ? 'Your Artwork' : 'Purchase Artwork'}</span>
                  </button>
                  <p className="text-[11px] text-center text-canvas-400 dark:text-canvas-500">
                    Direct payment with instant ownership transfer and buyer protection.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                    Private Collection Acquired
                  </span>
                  <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-1">
                    This artwork has been sold to a verified collector.
                  </p>
                </div>
              )}
            </div>

            {/* Curatorial Description */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100">
                About the Artwork
              </h3>
              <p className="text-sm text-canvas-600 dark:text-ivory-300 leading-relaxed whitespace-pre-line">
                {artwork.description}
              </p>
            </div>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-canvas-400 dark:text-canvas-500 flex items-center gap-1.5">
                  <FiTag size={13} />
                  <span>Metadata Tags:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {artwork.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/artworks?search=${encodeURIComponent(tag)}`}
                      className="text-xs bg-ivory-100 dark:bg-canvas-800 hover:bg-brand-500/10 hover:text-brand-500 text-canvas-600 dark:text-ivory-300 px-3 py-1 rounded-lg border border-ivory-300 dark:border-canvas-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Artworks Recommendation Carousel */}
        {similarArtworks.length > 0 && (
          <div className="mt-24 pt-16 border-t border-ivory-200 dark:border-canvas-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-canvas-950 dark:text-white">
                  Visually Similar Artworks
                </h3>
                <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-0.5">
                  Selected by ArtHub AI based on color harmony and composition
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarArtworks.map((art) => (
                <ArtworkCard key={art._id} artwork={art} />
              ))}
            </div>
          </div>
        )}

        {/* Collector Reviews & AI Moderated Comments */}
        <div className="mt-20 pt-16 border-t border-ivory-200 dark:border-canvas-800 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <FiMessageCircle size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-canvas-950 dark:text-white">
                Collector Reviews ({comments.length})
              </h3>
              <p className="text-xs text-canvas-500 dark:text-ivory-400">
                Verified reviews from collectors who acquired this artwork
              </p>
            </div>
          </div>

          {/* Comment Submission Form */}
          {user && (purchased || user.role === 'admin') ? (
            <form onSubmit={handleAddComment} className="mb-10 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Share your impressions of this artwork..."
                className="input-field text-sm"
                required
              />

              {moderationNotice && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                  {moderationNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={commentSubmitting || !newComment.trim()}
                className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40"
              >
                {commentSubmitting ? 'Verifying with AI...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-ivory-100 dark:bg-canvas-850 border border-ivory-300 dark:border-canvas-750 text-xs text-canvas-600 dark:text-ivory-300 mb-8">
              Only verified collectors who have acquired this artwork can leave public reviews.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="p-5 rounded-2xl bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-750 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-500 font-bold flex items-center justify-center text-xs">
                      {c.userName?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-canvas-900 dark:text-ivory-100 block">
                        {c.userName}
                      </span>
                      <span className="text-[10px] text-canvas-400">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-canvas-700 dark:text-ivory-200 leading-relaxed pl-10">
                  {c.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Room Preview Modal */}
        <RoomPreviewModal
          isOpen={showRoomModal}
          onClose={() => setShowRoomModal(false)}
          artwork={artwork}
        />

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          artwork={artwork}
        />
      </div>
    </div>
  );
}
