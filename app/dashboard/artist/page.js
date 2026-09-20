'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import Loading, { TableRowSkeleton } from '@/components/Loading';
import toast from 'react-hot-toast';
import SparklesIcon from '@/components/SparklesIcon';
import {
  FiPlus, FiEdit, FiTrash2, FiDollarSign, FiImage, FiUser,
  FiLock, FiSave, FiUpload, FiTrendingUp, FiEye,
  FiTag, FiCheckCircle, FiAlertCircle, FiShare2
} from 'react-icons/fi';

const CATEGORIES = ['Painting', 'Digital', 'Sculpture', 'Photography', 'Illustration', 'Mixed Media', 'Other'];

export default function ArtistDashboard() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [artworks, setArtworks] = useState([]);
  const [sales, setSales] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('artworks'); // 'artworks' | 'insights' | 'sales' | 'profile' | 'password'

  // Artwork creation form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Painting',
    subcategory: '',
    image: '',
    style: 'Contemporary',
    mood: 'Inspiring',
    tags: '',
    altText: '',
  });

  const [uploading, setUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiAssisted, setAiAssisted] = useState(false);

  // Profile states
  const [profileData, setProfileData] = useState({ name: '', avatar: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password change states
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'artist') { router.push('/'); return; }
    setProfileData({ name: user.name, avatar: user.avatar || '' });
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [artworksRes, salesRes, insightsRes] = await Promise.all([
        api.get('/artworks/artist/my-artworks'),
        api.get('/transactions/artist/sales'),
        api.get('/ai/artist-insights').catch(() => ({ data: null })),
      ]);
      setArtworks(artworksRes.data || []);
      setSales(salesRes.data || []);
      if (insightsRes.data) setInsights(insightsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Secure Image Upload (Uses local backend endpoint /api/upload)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('image', file);

    try {
      const { data } = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Artwork image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // AI Artwork Generator: Title, description, tags, style, mood, SEO, alt text
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
        subcategory: data.subcategory || prev.subcategory,
        style: data.style || prev.style,
        mood: data.mood || prev.mood,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : prev.tags,
        altText: data.altText || prev.altText,
      }));

      setAiAssisted(true);
      toast.success('Metadata generated with ArtHub AI! You can review & edit any field.');
    } catch (error) {
      toast.error('AI generation failed, please try again');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload an artwork image');
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim().toLowerCase()) : [],
        aiGenerated: { isAiAssisted: aiAssisted }
      };

      await api.post('/artworks', payload);
      toast.success('Artwork successfully published to ArtHub!');
      setFormData({
        title: '', description: '', price: '', category: 'Painting',
        subcategory: '', image: '', style: 'Contemporary', mood: 'Inspiring', tags: '', altText: ''
      });
      setAiAssisted(false);
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add artwork');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you certain you want to delete this artwork? This action cannot be undone.')) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success('Artwork deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete artwork');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (authLoading || !user || loading) return <Loading fullScreen text="Loading Artist Studio..." />;

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block">
              Creator Studio
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
              Artist Dashboard
            </h1>
            <p className="text-sm text-canvas-500 dark:text-ivory-400 mt-0.5">
              Manage your collections, track transactions, and leverage AI insights
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-xs sm:text-sm py-3 px-5 shadow-glow self-start sm:self-auto"
          >
            <FiPlus size={16} />
            <span>{showForm ? 'Close Studio Form' : 'Add New Artwork'}</span>
          </button>
        </div>

        {/* AI Studio Upload Modal/Form */}
        {showForm && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-canvas-900 border border-ivory-300 dark:border-canvas-700 shadow-luxury animate-slide-up">
            <div className="flex items-center justify-between pb-6 border-b border-ivory-200 dark:border-canvas-800 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-bold text-canvas-950 dark:text-white">
                    Publish Artwork to ArtHub
                  </h3>
                  {aiAssisted && (
                    <span className="text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25 px-2.5 py-0.5 rounded-full">
                      AI Enhanced
                    </span>
                  )}
                </div>
                <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-1">
                  Upload high-res image and optionally use ArtHub AI to automatically draft titles, descriptions, and tags
                </p>
              </div>

              {/* AI Auto-Fill Trigger */}
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiGenerating}
                className="btn-ai text-xs py-2.5 px-4 shadow-sm whitespace-nowrap"
              >
                <SparklesIcon className={aiGenerating ? 'animate-spin' : ''} />
                <span>{aiGenerating ? 'AI Analyzing...' : 'Generate with ArtHub AI'}</span>
              </button>
            </div>

            <form onSubmit={handleAddArtwork} className="space-y-6">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-2">
                  Artwork Image *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-canvas-600 dark:text-ivory-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 file:cursor-pointer"
                  />
                  {uploading && <span className="text-xs text-brand-500 animate-pulse font-medium">Uploading secure image...</span>}
                  {formData.image && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FiCheckCircle /> Image Ready
                    </span>
                  )}
                </div>

                {formData.image && (
                  <div className="mt-4 w-36 h-36 rounded-2xl overflow-hidden border border-ivory-300 dark:border-canvas-700 bg-ivory-100 dark:bg-canvas-800">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.g. Whispers of Midnight"
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
                    placeholder="250"
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
                    placeholder="E.g. Abstract Expressionism"
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
                    placeholder="E.g. Serene & Contemplative"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                    Search Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="oil, blue, textured, atmospheric"
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
                  placeholder="Describe your creative process, themes, materials, and composition..."
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="Text description for screen readers"
                  className="input-field text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ivory-200 dark:border-canvas-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary text-xs py-2.5 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary text-xs py-2.5 px-6"
                >
                  Publish Artwork
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-canvas-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'artworks', label: `My Artworks (${artworks.length})`, icon: <FiImage /> },
            { id: 'insights', label: 'AI Insights & Analytics', icon: <SparklesIcon /> },
            { id: 'sales', label: `Sales History (${sales.length})`, icon: <FiDollarSign /> },
            { id: 'profile', label: 'Profile Settings', icon: <FiUser /> },
            { id: 'password', label: 'Security', icon: <FiLock /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200 dark:hover:bg-canvas-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: MY ARTWORKS */}
        {activeTab === 'artworks' && (
          <div className="space-y-6">
            {artworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artworks.map((art) => (
                  <div key={art._id} className="card p-3 flex flex-col justify-between group">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-ivory-200 dark:bg-canvas-800 mb-3">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                      {art.isSold && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Sold
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FiEye size={12} />
                        <span>{art.views || 0} views</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-semibold text-sm text-canvas-900 dark:text-ivory-100 truncate">
                        {art.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-canvas-500">{art.category}</span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">${art.price}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-ivory-200 dark:border-canvas-800 flex items-center justify-between">
                      <Link
                        href={`/dashboard/artist/edit/${art._id}`}
                        className="p-2 text-canvas-500 hover:text-brand-500 rounded-lg hover:bg-ivory-100 dark:hover:bg-canvas-800"
                        title="Edit Artwork"
                      >
                        <FiEdit size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(art._id)}
                        className="p-2 text-canvas-500 hover:text-red-500 rounded-lg hover:bg-red-500/10"
                        title="Delete Artwork"
                      >
                        <FiTrash2 size={15} />
                      </button>
                      <Link
                        href={`/artworks/${art._id}`}
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Examine →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 card p-8">
                <FiImage size={40} className="mx-auto text-canvas-400 mb-3" />
                <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100">
                  No artworks in your studio yet
                </h3>
                <p className="text-xs text-canvas-500 dark:text-ivory-400 mt-1">
                  Click "Add New Artwork" above to upload and start sharing your pieces with collectors.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI INSIGHTS & ANALYTICS */}
        {activeTab === 'insights' && insights && (
          <div className="space-y-8 animate-fade-in">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="card p-5">
                <span className="text-xs text-canvas-400 font-medium block">Total Artwork Views</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-canvas-900 dark:text-white mt-1 block">
                  {insights.metrics?.totalViews || 0}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <FiTrendingUp /> Active engagement
                </span>
              </div>

              <div className="card p-5">
                <span className="text-xs text-canvas-400 font-medium block">Wishlist Additions</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-canvas-900 dark:text-white mt-1 block">
                  {insights.metrics?.totalWishlistCount || 0}
                </span>
                <span className="text-[11px] text-canvas-500">Collectors tracking pieces</span>
              </div>

              <div className="card p-5">
                <span className="text-xs text-canvas-400 font-medium block">Total Revenue</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-brand-600 dark:text-brand-400 mt-1 block">
                  ${insights.metrics?.totalRevenue?.toLocaleString() || '0'}
                </span>
                <span className="text-[11px] text-canvas-500">{insights.metrics?.totalSalesCount || 0} sales verified</span>
              </div>

              <div className="card p-5">
                <span className="text-xs text-canvas-400 font-medium block">Conversion Rate</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-canvas-900 dark:text-white mt-1 block">
                  {insights.metrics?.conversionRate || '0%'}
                </span>
                <span className="text-[11px] text-canvas-500">View to purchase ratio</span>
              </div>
            </div>

            {/* AI Actionable Growth Suggestions */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-500/10 via-ivory-100 dark:via-canvas-900 to-gold-500/10 border border-brand-500/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-glow">
                  <SparklesIcon size={16} />
                </div>
                <h3 className="font-display font-bold text-lg text-canvas-950 dark:text-white">
                  ArtHub AI Curatorial Intelligence
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(insights.aiSuggestions || []).map((sug, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-white dark:bg-canvas-800 border border-ivory-200 dark:border-canvas-700 shadow-xs space-y-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                      {sug.type}
                    </span>
                    <h4 className="font-display font-bold text-sm text-canvas-900 dark:text-ivory-100">
                      {sug.title}
                    </h4>
                    <p className="text-xs text-canvas-600 dark:text-ivory-300 leading-relaxed">
                      {sug.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div className="card p-6 sm:p-8">
              <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100 mb-4">
                Category Retention Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(insights.categoryStats || {}).map(([cat, stat]) => (
                  <div key={cat} className="p-4 rounded-xl bg-ivory-100 dark:bg-canvas-800 border border-ivory-200 dark:border-canvas-750">
                    <span className="text-xs font-bold text-canvas-800 dark:text-ivory-200 block">{cat}</span>
                    <div className="mt-2 text-xs space-y-1 text-canvas-500 dark:text-ivory-400">
                      <div className="flex justify-between">
                        <span>Artworks:</span> <strong className="text-canvas-800 dark:text-ivory-200">{stat.count}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Views:</span> <strong className="text-canvas-800 dark:text-ivory-200">{stat.views}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Sold:</span> <strong className="text-brand-600 dark:text-brand-400">{stat.sold}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SALES HISTORY */}
        {activeTab === 'sales' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-ivory-200 dark:border-canvas-750">
              <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100">
                Collector Transaction History
              </h3>
            </div>
            {sales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-ivory-100 dark:bg-canvas-800 text-canvas-500 uppercase text-[11px]">
                    <tr>
                      <th className="px-6 py-3">Artwork</th>
                      <th className="px-6 py-3">Collector</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200 dark:divide-canvas-800">
                    {sales.map((t) => (
                      <tr key={t._id}>
                        <td className="px-6 py-4 font-semibold text-canvas-900 dark:text-ivory-100">
                          {t.artworkTitle || t.artwork?.title || 'Original Artwork'}
                        </td>
                        <td className="px-6 py-4 text-canvas-600 dark:text-ivory-300">
                          {t.user?.name || t.userEmail || 'Collector'}
                        </td>
                        <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">
                          ${t.amount}
                        </td>
                        <td className="px-6 py-4 text-canvas-500">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-canvas-400">
                No sales recorded yet. Keep promoting your art on ArtHub!
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-xl card p-6 sm:p-8">
            <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100 mb-6">
              Artist Profile Information
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="btn-primary text-xs py-3 px-6 mt-4"
              >
                <FiSave />
                <span>{profileSaving ? 'Saving Changes...' : 'Save Profile'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: PASSWORD SETTINGS */}
        {activeTab === 'password' && (
          <div className="max-w-xl card p-6 sm:p-8">
            <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100 mb-6">
              Update Studio Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="btn-primary text-xs py-3 px-6 mt-4"
              >
                <FiLock />
                <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
