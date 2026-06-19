'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiImage, FiUser, FiLock, FiSave, FiUpload } from 'react-icons/fi';

export default function ArtistDashboard() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('artworks');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Painting', image: ''
  });
  const [uploading, setUploading] = useState(false);

  // Profile edit states
  const [profileData, setProfileData] = useState({ name: '', avatar: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password change states
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'artist') { router.push('/'); return; }
    setProfileData({ name: user.name, avatar: user.avatar || '' });
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [artworksRes, salesRes] = await Promise.all([
        api.get('/artworks/artist/my-artworks'),
        api.get('/transactions/artist/sales'),
      ]);
      setArtworks(artworksRes.data);
      setSales(salesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
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
      setFormData({ ...formData, image: data.data.url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    try {
      await api.post('/artworks', formData);
      toast.success('Artwork added');
      setFormData({ title: '', description: '', price: '', category: 'Painting', image: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add artwork');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this artwork?')) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success('Artwork deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: 'POST', body: formDataImg }
      );
      const data = await response.json();
      setProfileData((prev) => ({ ...prev, avatar: data.data.url }));
      toast.success('Avatar uploaded');
    } catch (error) {
      toast.error('Avatar upload failed');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save profile
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Change password
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
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user || loading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold">Artist Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add Artwork</span>
          </button>
        </div>

        {/* Add Artwork Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Add New Artwork</h2>
            <form onSubmit={handleAddArtwork} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option>Painting</option>
                  <option>Digital</option>
                  <option>Sculpture</option>
                  <option>Photography</option>
                  <option>Illustration</option>
                  <option>Mixed Media</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input-field"
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-4 w-48 h-48 object-cover rounded-lg" />
                )}
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {uploading ? 'Uploading...' : 'Add Artwork'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('artworks')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'artworks'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiImage className="inline mr-2" />
            My Artworks
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'sales'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiDollarSign className="inline mr-2" />
            Sales History
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiUser className="inline mr-2" />
            Profile
          </button>
        </div>

        {/* My Artworks */}
        {activeTab === 'artworks' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {artworks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Image</th>
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artworks.map((artwork) => (
                      <tr key={artwork._id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 px-4">
                          <img src={artwork.image} alt={artwork.title} className="w-16 h-16 object-cover rounded" />
                        </td>
                        <td className="py-4 px-4 font-medium">{artwork.title}</td>
                        <td className="py-4 px-4">${artwork.price}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            artwork.isSold
                              ? 'bg-red-100 text-red-800'
                              : artwork.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {artwork.isSold ? 'Sold' : artwork.isPublished ? 'Published' : 'Unpublished'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-3">
                            <Link
                              href={`/artworks/${artwork._id}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              View
                            </Link>
                            {!artwork.isSold && (
                              <Link
                                href={`/dashboard/artist/edit/${artwork._id}`}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                              >
                                <FiEdit size={14} />
                                <span>Edit</span>
                              </Link>
                            )}
                            <button
                              onClick={() => handleDelete(artwork._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No artworks yet. Add your first artwork!</p>
            )}
          </div>
        )}

        {/* Sales History */}
        {activeTab === 'sales' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {sales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Artwork</th>
                      <th className="text-left py-3 px-4">Buyer</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale._id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 px-4">{sale.artworkTitle}</td>
                        <td className="py-4 px-4">{sale.userEmail}</td>
                        <td className="py-4 px-4 font-semibold">${sale.amount}</td>
                        <td className="py-4 px-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No sales yet</p>
            )}
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            {/* Edit Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <FiUser className="text-primary-600" />
                <span>Edit Profile</span>
              </h2>
              <form onSubmit={handleProfileSave} className="space-y-5 max-w-lg">

                {/* Avatar */}
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-primary-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-2xl font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center space-x-2 btn-outline py-2 px-4 text-sm">
                      <FiUpload size={14} />
                      <span>{avatarUploading ? 'Uploading...' : 'Change Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={avatarUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>

                {/* Email (read only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Role (read only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value="Artist"
                    readOnly
                    className="input-field opacity-60 cursor-not-allowed capitalize"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSaving || avatarUploading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <FiSave />
                  <span>{profileSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <FiLock className="text-primary-600" />
                <span>Change Password</span>
              </h2>
              {user.googleId && !user.password ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-yellow-800 dark:text-yellow-300 text-sm">
                  Password change is not available for Google accounts.
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input-field"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-field"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-field"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <FiLock />
                    <span>{passwordSaving ? 'Changing...' : 'Change Password'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}