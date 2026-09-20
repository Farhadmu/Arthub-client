'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import SparklesIcon from '@/components/SparklesIcon';
import { FiSave, FiArrowLeft, FiUpload, FiCheckCircle } from 'react-icons/fi';

const CATEGORIES = ['Painting', 'Digital', 'Sculpture', 'Photography', 'Illustration', 'Mixed Media', 'Other'];

export default function EditArtworkPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Painting',
    subcategory: '',
    image: '',
    style: '',
    mood: '',
    tags: '',
    altText: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'artist') { router.push('/'); return; }
    fetchArtwork();
  }, [user]);

  const fetchArtwork = async () => {
    try {
      const { data } = await api.get(`/artworks/${id}`);

      if (data.artist?._id !== user._id && data.artist !== user._id) {
        toast.error('You are not authorized to edit this artwork');
        router.push('/dashboard/artist');
        return;
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        category: data.category || 'Painting',
        subcategory: data.subcategory || '',
        image: data.image || '',
        style: data.style || '',
        mood: data.mood || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        altText: data.altText || '',
      });
      setPreview(data.image);
    } catch (error) {
      toast.error('Failed to load artwork');
      router.push('/dashboard/artist');
    } finally {
      setLoading(false);
    }
  };

  // Secure backend upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formDataImg = new FormData();
    formDataImg.append('image', file);

    try {
      const { data } = await api.post('/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: data.url }));
      setPreview(data.url);
      toast.success('Artwork image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // AI Assistant in editor
  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const { data } = await api.post('/ai/generate-artwork-metadata', {
        imageUrl: formData.image,
        initialTitle: formData.title,
        category: formData.category,
        hint: formData.style,
      });

      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        category: data.category || prev.category,
        style: data.style || prev.style,
        mood: data.mood || prev.mood,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : prev.tags,
        altText: data.altText || prev.altText,
      }));

      toast.success('Metadata polished with ArtHub AI!');
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim().toLowerCase()) : [],
      };
      await api.put(`/artworks/${id}`, payload);
      toast.success('Artwork updated successfully!');
      router.push('/dashboard/artist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update artwork');
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) return <Loading fullScreen text="Loading Artwork Editor..." />;

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/dashboard/artist')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-canvas-500 hover:text-brand-500 dark:text-ivory-400 transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>Back to Studio Dashboard</span>
          </button>

          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiGenerating}
            className="btn-ai text-xs py-2.5 px-3.5 shadow-sm"
          >
            <SparklesIcon className={aiGenerating ? 'animate-spin' : ''} />
            <span>{aiGenerating ? 'AI Polishing...' : 'Polish with ArtHub AI'}</span>
          </button>
        </div>

        <div className="card p-6 sm:p-10 shadow-luxury">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-canvas-950 dark:text-white mb-6">
            Edit Artwork
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview & Replacement */}
            <div>
              <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-2">
                Artwork Visual Preview
              </label>
              {preview && (
                <div className="mb-4 w-44 h-44 rounded-2xl overflow-hidden border border-ivory-300 dark:border-canvas-700 bg-ivory-100 dark:bg-canvas-800">
                  <img src={preview} alt="Artwork preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-canvas-600 dark:text-ivory-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 file:cursor-pointer"
              />
              {uploading && <span className="text-xs text-brand-500 ml-3 animate-pulse">Uploading new file...</span>}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field text-sm cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Artistic Style
                </label>
                <input
                  type="text"
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Emotional Mood
                </label>
                <input
                  type="text"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Metadata Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                Curatorial Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-ivory-200 dark:border-canvas-800">
              <button
                type="button"
                onClick={() => router.push('/dashboard/artist')}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-primary text-xs py-2.5 px-6"
              >
                <FiSave />
                <span>{saving ? 'Saving Updates...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}