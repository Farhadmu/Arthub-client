'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiStar, FiUser, FiImage, FiLock, FiSave, FiUpload, FiCheck } from 'react-icons/fi';

export default function UserDashboard() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');

  // Profile states
  const [profileData, setProfileData] = useState({ name: '', avatar: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password states
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'user') { router.push('/'); return; }
    setProfileData({ name: user.name, avatar: user.avatar || '' });
    fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const { data } = await api.get('/transactions/user/purchases');
      setPurchases(data);
    } catch (error) {
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier) => {
    try {
      const { data } = await api.post('/transactions/create-subscription-session', { tier });
      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to create subscription');
    }
  };

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

  const subscriptionTiers = [
    { key: 'free', name: 'Free', price: 0, maxPurchases: 3, current: user.subscriptionTier === 'free' },
    { key: 'pro', name: 'Pro', price: 9.99, maxPurchases: 9, current: user.subscriptionTier === 'pro' },
    { key: 'premium', name: 'Premium', price: 19.99, maxPurchases: 'Unlimited', current: user.subscriptionTier === 'premium' },
  ];

  // Artworks bought (from purchase transactions that have artwork populated)
  const boughtArtworks = purchases.filter((p) => p.artwork);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-8">My Dashboard</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'purchases', label: 'Purchase History', icon: <FiShoppingBag className="inline mr-2" /> },
            { key: 'artworks', label: 'Bought Artworks', icon: <FiImage className="inline mr-2" /> },
            { key: 'subscription', label: 'Subscription', icon: <FiStar className="inline mr-2" /> },
            { key: 'profile', label: 'Profile', icon: <FiUser className="inline mr-2" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 px-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Purchase History */}
        {activeTab === 'purchases' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Purchase History</h2>
            {purchases.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Artwork Name</th>
                      <th className="text-left py-3 px-4">Artist</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Purchase Date</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase._id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 px-4 font-medium">{purchase.artworkTitle || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{purchase.artistEmail || 'N/A'}</td>
                        <td className="py-4 px-4 font-semibold text-primary-600">${purchase.amount}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {purchase.artwork && (
                            <Link
                              href={`/artworks/${purchase.artwork._id}`}
                              className="text-primary-600 hover:underline text-sm font-medium"
                            >
                              View →
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No purchases yet</p>
                <Link href="/artworks" className="btn-primary inline-block mt-4">Browse Artworks</Link>
              </div>
            )}
          </div>
        )}

        {/* Bought Artworks - Gallery View */}
        {activeTab === 'artworks' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Bought Artworks</h2>
            {boughtArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {boughtArtworks.map((purchase) => (
                  <Link
                    key={purchase._id}
                    href={`/artworks/${purchase.artwork._id}`}
                    className="group block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={purchase.artwork.image}
                        alt={purchase.artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details →
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {purchase.artwork.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">${purchase.amount}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiImage size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No artworks purchased yet</p>
                <Link href="/artworks" className="btn-primary inline-block mt-4">Browse Artworks</Link>
              </div>
            )}
          </div>
        )}

        {/* Subscription */}
        {activeTab === 'subscription' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Subscription Plans</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Current plan: <span className="font-semibold text-primary-600 capitalize">{user.subscriptionTier}</span>
              {' '}· Purchases used: <span className="font-semibold">{user.purchaseCount || 0}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative border-2 rounded-xl p-6 ${
                    tier.current
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {tier.current && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      CURRENT PLAN
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold mb-1 text-primary-600">
                    ${tier.price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center space-x-2">
                      <FiCheck className="text-green-500" />
                      <span>
                        {tier.maxPurchases === 'Unlimited'
                          ? 'Unlimited purchases'
                          : `Max ${tier.maxPurchases} purchases`}
                      </span>
                    </li>
                  </ul>
                  {tier.current ? (
                    <div className="bg-primary-600 text-white py-2 rounded-lg text-center font-semibold text-sm">
                      Active
                    </div>
                  ) : tier.key === 'free' ? (
                    <div className="border border-gray-300 dark:border-gray-600 text-gray-500 py-2 rounded-lg text-center text-sm">
                      Default Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(tier.key)}
                      className="w-full btn-primary text-sm py-2"
                    >
                      Upgrade to {tier.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            {/* Edit Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <FiUser className="text-primary-600" />
                <span>Edit Profile</span>
              </h2>
              <form onSubmit={handleProfileSave} className="space-y-5 max-w-lg">

                {/* Avatar */}
                <div className="flex items-center space-x-5">
                  <div>
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

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" value={user.email} readOnly className="input-field opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Subscription */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subscription Tier</label>
                  <input type="text" value={user.subscriptionTier} readOnly className="input-field opacity-60 cursor-not-allowed capitalize" />
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

            {/* Change Password */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <FiLock className="text-primary-600" />
                <span>Change Password</span>
              </h2>
              {user.googleId ? (
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