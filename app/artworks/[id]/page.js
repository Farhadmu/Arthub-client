'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiShoppingCart, FiMessageCircle, FiCalendar, FiCheck, FiX } from 'react-icons/fi';

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const [artworkRes, commentsRes] = await Promise.all([
          api.get(`/artworks/${id}`),
          api.get(`/comments/artwork/${id}`),
        ]);
        setArtwork(artworkRes.data);
        setComments(commentsRes.data);

        if (user) {
          const purchaseRes = await api.get('/transactions/user/purchases');
          const hasPurchased = purchaseRes.data.some(t => t.artwork?._id === id);
          setPurchased(hasPurchased);
        }
      } catch (error) {
        toast.error('Failed to load artwork');
        router.push('/artworks');
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) { router.push('/login'); return; }
    setPurchasing(true);
    try {
      const { data } = await api.post('/transactions/create-purchase-session', { artworkId: id });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
      setPurchasing(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentSubmitting(true);
    try {
      const { data } = await api.post(`/comments/artwork/${id}`, { comment: newComment });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.comment);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const { data } = await api.put(`/comments/${commentId}`, { comment: editingText });
      setComments(comments.map(c => c._id === commentId ? data : c));
      setEditingCommentId(null);
      setEditingText('');
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteArtwork = async () => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success('Artwork deleted');
      router.push('/dashboard/artist');
    } catch (error) {
      toast.error('Failed to delete artwork');
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!artwork) return <div className="text-center py-16">Artwork not found</div>;

  const isOwner = user && artwork.artist?._id === user._id;
  const canPurchase = user && !isOwner && !artwork.isSold;

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-brown-700 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
              {artwork.isSold && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                  SOLD
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                  {artwork.category}
                </span>
              </div>

              <h1 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100 mb-3">
                {artwork.title}
              </h1>

              <Link
                href={`/artworks?search=${artwork.artistName}`}
                className="text-lg text-primary-600 hover:text-primary-700 mb-4 font-medium"
              >
                by {artwork.artistName}
              </Link>

              <div className="flex items-center mb-6">
                <span className="text-4xl font-bold text-primary-600">${artwork.price}</span>
              </div>

              <div className="flex items-center text-brown-500 dark:text-cream-400 mb-6 text-sm">
                <FiCalendar className="mr-2" />
                <span>Uploaded {new Date(artwork.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="text-xl font-semibold mb-2 text-brown-800 dark:text-cream-100">About this Artwork</h3>
                <p className="text-brown-600 dark:text-cream-300 leading-relaxed">{artwork.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {canPurchase && !artwork.isSold && (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-3 disabled:opacity-70"
                  >
                    <FiShoppingCart />
                    <span>{purchasing ? 'Redirecting to checkout...' : 'Buy Now'}</span>
                  </button>
                )}

                {artwork.isSold && (
                  <div className="w-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 py-3 rounded-lg text-center font-semibold border border-red-200 dark:border-red-800">
                    This artwork has been sold
                  </div>
                )}

                {purchased && (
                  <div className="w-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-3 rounded-lg text-center font-semibold border border-green-200 dark:border-green-800">
                    ✓ You own this artwork
                  </div>
                )}

                {isOwner && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => router.push(`/dashboard/artist/edit/${artwork._id}`)}
                      className="flex-1 btn-outline flex items-center justify-center space-x-2"
                    >
                      <FiEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDeleteArtwork}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <FiTrash2 />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {!user && (
                  <div className="text-center text-brown-500 dark:text-cream-400 bg-cream-200 dark:bg-brown-600 p-4 rounded-lg">
                    <Link href="/login" className="text-primary-600 hover:underline font-medium">Login</Link>{' '}
                    to purchase or comment on this artwork
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-brown-700 rounded-xl shadow-lg p-8 mt-8"
        >
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center text-brown-800 dark:text-cream-100">
            <FiMessageCircle className="mr-2 text-primary-600" />
            Comments ({comments.length})
          </h2>

          {/* Comment Form — only for buyers */}
          {purchased && !comments.some(c => c.user?._id === user?._id || c.user === user?._id) && (
            <form onSubmit={handleAddComment} className="mb-8 bg-cream-100 dark:bg-brown-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-brown-600 dark:text-cream-300 mb-3">
                Share your thoughts about this artwork:
              </p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review..."
                className="input-field mb-3"
                rows="3"
                required
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-brown-400 dark:text-cream-500">{newComment.length}/500</span>
                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="btn-primary py-2 px-6 disabled:opacity-50"
                >
                  {commentSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}

          {user && !purchased && !isOwner && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-4 rounded-lg mb-8 text-sm">
              💡 You need to purchase this artwork to leave a comment.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const isOwnerOfComment = user && (comment.user?._id === user._id || comment.user === user._id);
                const canModify = isOwnerOfComment || user?.role === 'admin';

                return (
                  <div key={comment._id} className="border-b border-cream-300 dark:border-brown-600 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={comment.userAvatar || comment.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=c4431f&color=fff`}
                        alt={comment.userName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <h4 className="font-semibold text-brown-800 dark:text-cream-100">{comment.userName}</h4>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-brown-400 dark:text-cream-500">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            {canModify && editingCommentId !== comment._id && (
                              <div className="flex items-center space-x-2">
                                {isOwnerOfComment && (
                                  <button
                                    onClick={() => startEditComment(comment)}
                                    className="text-blue-500 hover:text-blue-600 text-sm flex items-center space-x-1"
                                  >
                                    <FiEdit size={14} />
                                    <span className="hidden sm:inline">Edit</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-red-500 hover:text-red-600 text-sm flex items-center space-x-1"
                                >
                                  <FiTrash2 size={14} />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingCommentId === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="input-field mb-2"
                              rows="3"
                              maxLength={500}
                              autoFocus
                            />
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 px-4 rounded-lg transition-colors"
                              >
                                <FiCheck size={14} />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={cancelEditComment}
                                className="flex items-center space-x-1 btn-outline text-sm py-1.5 px-4"
                              >
                                <FiX size={14} />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-brown-600 dark:text-cream-300 leading-relaxed">{comment.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <FiMessageCircle size={48} className="mx-auto text-brown-300 dark:text-brown-600 mb-4" />
                <p className="text-brown-500 dark:text-cream-400">No comments yet. Be the first to comment after purchasing!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}