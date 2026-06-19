'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';

const CATEGORIES = ['Painting', 'Digital', 'Sculpture', 'Photography', 'Illustration', 'Mixed Media', 'Other'];

export default function EditArtworkPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Painting', image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'artist') { router.push('/'); return; }
    fetchArtwork();
  }, [user]);

  const fetchArtwork = async () => {
    try {
      const { data } = await api.get(`/artworks/${id}`);

      // শুধু নিজের artwork edit করতে পারবে
      if (data.artist?._id !== user._id && data.artist !== user._id) {
        toast.error('You are not authorized to edit this artwork');
        router.push('/dashboard/artist');
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
      });
      setPreview(data.image);
    } catch (error) {
      toast.error('Failed to load artwork');
      router.push('/dashboard/artist');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: 'POST', body: formDataImg }
      );
      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.data.url }));
      setPreview(data.data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/artworks/${id}`, formData);
      toast.success('Artwork updated successfully!');
      router.push('/dashboard/artist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update artwork');
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Edit Artwork</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update your artwork details below</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter artwork title"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="5"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                placeholder="Describe your artwork..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Artwork Image
              </label>

              {/* Current Preview */}
              {preview && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow"
                  />
                </div>
              )}

              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                <div className="text-center">
                  <FiUpload className="mx-auto mb-2 text-gray-400" size={24} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {uploading ? 'Uploading...' : 'Click to upload new image'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3 text-base disabled:opacity-50"
              >
                <FiSave />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 btn-outline py-3 text-base"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}