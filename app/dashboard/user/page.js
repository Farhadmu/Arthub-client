'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import {
  FiShoppingBag, FiStar, FiUser, FiImage, FiLock,
  FiSave, FiUpload, FiCheck, FiBell, FiCheckCircle
} from 'react-icons/fi';

export default function UserDashboard() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const router = useRouter();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' | 'notifications' | 'subscription' | 'profile' | 'password'

  // Profile states
  const [profileData, setProfileData] = useState({ name: '', avatar: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password states
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'user') { router.push('/'); return; }
    setProfileData({ name: user.name, avatar: user.avatar || '' });
    fetchPurchases();
  }, [user, authLoading]);

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
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error('Failed to create subscription');
    }
  };

  // Secure local avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    const form = new FormData();
    form.append('image', file);

    try {
      const { data } = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData(prev => ({ ...prev, avatar: data.url }));
      toast.success('Avatar image uploaded');
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
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (authLoading || !user || loading) return <Loading fullScreen text="Loading Collector Dashboard..." />;

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block">
            Collector Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-canvas-500 dark:text-ivory-400 mt-1">
            Current Tier: <strong className="uppercase text-brand-500">{user.subscriptionTier || 'Free'}</strong> • {user.purchaseCount || 0} pieces collected
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-canvas-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'purchases', label: `My Acquisitions (${purchases.length})`, icon: <FiShoppingBag /> },
            { id: 'notifications', label: `Notifications (${unreadCount})`, icon: <FiBell /> },
            { id: 'subscription', label: 'Membership Tier', icon: <FiStar /> },
            { id: 'profile', label: 'Profile', icon: <FiUser /> },
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

        {/* TAB 1: PURCHASES */}
        {activeTab === 'purchases' && (
          <div>
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((t) => (
                  <div key={t._id} className="card p-4 flex flex-col justify-between group">
                    <div>
                      {t.artwork?.image ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-ivory-200 dark:bg-canvas-800 mb-3">
                          <img src={t.artwork.image} alt={t.artworkTitle} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-3">
                          <FiImage size={24} />
                        </div>
                      )}
                      <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100">
                        {t.artworkTitle || t.artwork?.title || 'Original Piece'}
                      </h3>
                      <p className="text-xs text-canvas-500 mt-0.5">
                        Amount Paid: <strong className="text-brand-600 dark:text-brand-400">${t.amount}</strong>
                      </p>
                      <p className="text-[11px] text-canvas-400">
                        Date: {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-ivory-200 dark:border-canvas-800 flex items-center justify-between">
                      {t.artwork?._id && (
                        <Link
                          href={`/artworks/${t.artwork._id}`}
                          className="btn-outline text-xs py-1.5 px-3"
                        >
                          View & Leave Review
                        </Link>
                      )}
                      <span className="text-[11px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 card p-8 max-w-lg mx-auto">
                <FiShoppingBag size={36} className="mx-auto text-brand-500 mb-3" />
                <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100">
                  No artworks acquired yet
                </h3>
                <p className="text-xs text-canvas-500 mt-1 mb-6">
                  Explore original pieces across paintings, digital art, and sculptures.
                </p>
                <Link href="/artworks" className="btn-primary text-xs py-2.5 px-5">
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IN-APP NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="card overflow-hidden max-w-3xl">
            <div className="p-5 border-b border-ivory-200 dark:border-canvas-750 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100">
                Notification History
              </h3>
            </div>
            {notifications.length > 0 ? (
              <div className="divide-y divide-ivory-200 dark:divide-canvas-800">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`p-4 flex gap-3.5 items-start cursor-pointer transition-colors ${
                      n.read ? 'bg-transparent' : 'bg-brand-500/5 dark:bg-brand-500/10'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-canvas-800 border border-ivory-200 dark:border-canvas-700 shadow-xs">
                      <FiBell className="text-brand-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-canvas-900 dark:text-ivory-100">{n.title}</h4>
                        <span className="text-[10px] text-canvas-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-canvas-600 dark:text-ivory-300 mt-0.5">{n.message}</p>
                      {n.link && (
                        <Link href={n.link} className="text-[11px] font-semibold text-brand-600 hover:underline mt-1 inline-block">
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-canvas-400">
                No notifications logged.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEMBERSHIP TIERS */}
        {activeTab === 'subscription' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className={`card p-6 flex flex-col justify-between ${user.subscriptionTier === 'free' ? 'border-2 border-brand-500' : ''}`}>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-canvas-400">Free Collector</span>
                <div className="text-3xl font-display font-bold text-canvas-900 dark:text-white">$0</div>
                <p className="text-xs text-canvas-500">Perfect for casual discovery</p>
                <ul className="text-xs space-y-2 text-canvas-600 dark:text-ivory-300 pt-2">
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Up to 3 Artwork purchases</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Full AI Curator Access</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Unlimited Visual Search</li>
                </ul>
              </div>
              <div className="pt-6">
                <span className="text-xs font-semibold text-canvas-400 block text-center">
                  {user.subscriptionTier === 'free' ? 'Current Plan' : 'Free Baseline'}
                </span>
              </div>
            </div>

            {/* Pro */}
            <div className={`card p-6 flex flex-col justify-between ${user.subscriptionTier === 'pro' ? 'border-2 border-brand-500' : ''}`}>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Pro Collector</span>
                <div className="text-3xl font-display font-bold text-canvas-900 dark:text-white">$9.99<span className="text-xs font-normal text-canvas-400">/mo</span></div>
                <p className="text-xs text-canvas-500">For avid art collectors</p>
                <ul className="text-xs space-y-2 text-canvas-600 dark:text-ivory-300 pt-2">
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Up to 9 Artwork purchases</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Early access to featured drops</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Priority AI recommendations</li>
                </ul>
              </div>
              <div className="pt-6">
                {user.subscriptionTier === 'pro' ? (
                  <span className="btn-secondary w-full text-xs py-2.5 justify-center pointer-events-none">Active Plan</span>
                ) : (
                  <button onClick={() => handleSubscribe('pro')} className="btn-primary w-full text-xs py-2.5 justify-center">
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>

            {/* Premium */}
            <div className={`card p-6 flex flex-col justify-between bg-gradient-to-tr from-brand-500/5 to-gold-500/10 ${user.subscriptionTier === 'premium' ? 'border-2 border-gold-500' : ''}`}>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Patron Premium</span>
                <div className="text-3xl font-display font-bold text-canvas-900 dark:text-white">$19.99<span className="text-xs font-normal text-canvas-400">/mo</span></div>
                <p className="text-xs text-canvas-500">Unrestricted fine art patronage</p>
                <ul className="text-xs space-y-2 text-canvas-600 dark:text-ivory-300 pt-2">
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> <strong>Unlimited</strong> artwork purchases</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> VIP Private exhibitions</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> Direct artist commission line</li>
                </ul>
              </div>
              <div className="pt-6">
                {user.subscriptionTier === 'premium' ? (
                  <span className="btn-secondary w-full text-xs py-2.5 justify-center pointer-events-none">Active Plan</span>
                ) : (
                  <button onClick={() => handleSubscribe('premium')} className="btn-ai w-full text-xs py-2.5 justify-center">
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="card p-6 sm:p-8 max-w-xl">
            <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100 mb-6">
              Collector Profile Information
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-canvas-700 dark:text-ivory-200 mb-1.5">
                  Avatar Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-xs text-canvas-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-brand-500 file:text-white file:cursor-pointer"
                  />
                  {avatarUploading && <span className="text-xs text-brand-500 animate-pulse">Uploading...</span>}
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="btn-primary text-xs py-2.5 px-6 mt-2"
              >
                <FiSave />
                <span>{profileSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: PASSWORD */}
        {activeTab === 'password' && (
          <div className="card p-6 sm:p-8 max-w-xl">
            <h3 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100 mb-6">
              Account Security
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
                  Confirm Password
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
                className="btn-primary text-xs py-2.5 px-6 mt-2"
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
