'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import {
  FiUsers, FiImage, FiDollarSign, FiTrendingUp, FiTrash2,
  FiShield, FiCheckCircle, FiXCircle, FiAlertTriangle, FiCheck
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const CHART_COLORS = ['#e07a5f', '#d4af37', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [flaggedComments, setFlaggedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'moderation' | 'users' | 'artworks' | 'transactions'

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [usersRes, artworksRes, transactionsRes, analyticsRes, flaggedRes] = await Promise.all([
        api.get('/users'),
        api.get('/artworks/admin/all'),
        api.get('/transactions/all'),
        api.get('/transactions/analytics'),
        api.get('/comments/admin/flagged').catch(() => ({ data: [] })),
      ]);
      setUsers(usersRes.data || []);
      setArtworks(artworksRes.data?.artworks || []);
      setTransactions(transactionsRes.data || []);
      setAnalytics(analyticsRes.data || null);
      setFlaggedComments(flaggedRes.data || []);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteArtwork = async (id) => {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success('Artwork deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete artwork');
    }
  };

  const handleModerateComment = async (commentId, status) => {
    try {
      await api.put(`/comments/${commentId}/moderate`, { status });
      toast.success(`Comment status updated to ${status}`);
      setFlaggedComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      toast.error('Failed to moderate comment');
    }
  };

  if (authLoading || !user || loading) return <Loading fullScreen text="Loading Admin Control Center..." />;

  const pieData = analytics?.salesByCategory?.map((item) => ({
    name: item._id || 'Unknown',
    value: item.count,
  })) || [];

  const barData = analytics?.monthlySales?.map((item) => ({
    month: item._id,
    revenue: parseFloat((item.total || 0).toFixed(2)),
    sales: item.count,
  })) || [];

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-canvas-950 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block">
              Governance & Analytics
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-canvas-950 dark:text-white">
              Platform Administration
            </h1>
          </div>

          {flaggedComments.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <FiAlertTriangle />
              <span>{flaggedComments.length} Flagged comments awaiting review</span>
            </div>
          )}
        </div>

        {/* Analytics Top Cards */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-canvas-400 font-medium">Registered Collectors</span>
                <FiUsers className="text-brand-500" size={18} />
              </div>
              <span className="text-2xl sm:text-3xl font-display font-bold text-canvas-900 dark:text-white">
                {analytics.totalUsers}
              </span>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-canvas-400 font-medium">Verified Artists</span>
                <FiImage className="text-gold-500" size={18} />
              </div>
              <span className="text-2xl sm:text-3xl font-display font-bold text-canvas-900 dark:text-white">
                {analytics.totalArtists}
              </span>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-canvas-400 font-medium">Artworks Acquired</span>
                <FiTrendingUp className="text-emerald-500" size={18} />
              </div>
              <span className="text-2xl sm:text-3xl font-display font-bold text-canvas-900 dark:text-white">
                {analytics.totalArtworksSold}
              </span>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-canvas-400 font-medium">Platform Volume</span>
                <FiDollarSign className="text-brand-500" size={18} />
              </div>
              <span className="text-2xl sm:text-3xl font-display font-bold text-brand-600 dark:text-brand-400">
                ${analytics.totalRevenue?.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-canvas-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Charts' },
            { id: 'moderation', label: `AI Moderation Queue (${flaggedComments.length})` },
            { id: 'users', label: `User Directory (${users.length})` },
            { id: 'artworks', label: `Artworks Catalog (${artworks.length})` },
            { id: 'transactions', label: `Transactions (${transactions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200 dark:hover:bg-canvas-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & CHARTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 card p-6 sm:p-8">
              <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100 mb-6">
                Monthly Transaction Volume (USD)
              </h3>
              <div className="h-72 w-full">
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#171b24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                      <Bar dataKey="revenue" fill="#e07a5f" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-canvas-400">
                    No monthly transaction data available yet
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 card p-6 sm:p-8 flex flex-col justify-between">
              <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100 mb-4">
                Sales by Medium
              </h3>
              <div className="h-64 w-full">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-canvas-400">
                    No sales data yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI COMMENT MODERATION QUEUE */}
        {activeTab === 'moderation' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-ivory-200 dark:border-canvas-750 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-canvas-900 dark:text-ivory-100">
                  AI Moderation Queue
                </h3>
                <p className="text-xs text-canvas-500 dark:text-ivory-400">
                  Reviews flagged by AI content filter for profanity, spam, or harassment
                </p>
              </div>
            </div>

            {flaggedComments.length > 0 ? (
              <div className="divide-y divide-ivory-200 dark:divide-canvas-800">
                {flaggedComments.map((c) => (
                  <div key={c._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          c.status === 'BLOCKED' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {c.status}
                        </span>
                        <span className="text-xs font-bold text-canvas-900 dark:text-ivory-100">
                          {c.user?.name || c.userName}
                        </span>
                        <span className="text-[11px] text-canvas-400">
                          on "{c.artwork?.title || 'Artwork'}"
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-canvas-700 dark:text-ivory-200 bg-ivory-100 dark:bg-canvas-800 p-3 rounded-xl">
                        "{c.comment}"
                      </p>
                      <p className="text-[11px] text-canvas-400">
                        Reason: <strong className="text-canvas-600 dark:text-ivory-300">{c.moderationReason}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleModerateComment(c._id, 'SAFE')}
                        className="btn-secondary text-xs py-2 px-3 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <FiCheck size={14} />
                        <span>Approve (SAFE)</span>
                      </button>
                      <button
                        onClick={() => handleModerateComment(c._id, 'BLOCKED')}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-semibold"
                      >
                        <FiXCircle size={15} />
                        <span>Block</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-xs text-canvas-400">
                <FiCheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
                <span>All community comments are reviewed and clear!</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-ivory-100 dark:bg-canvas-800 text-canvas-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Tier</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-canvas-800">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4">
                        <span className="font-bold text-canvas-900 dark:text-ivory-100 block">{u.name}</span>
                        <span className="text-[11px] text-canvas-400">{u.email}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-600 dark:text-brand-400 uppercase text-xs">
                        {u.role}
                      </td>
                      <td className="px-6 py-4 text-canvas-600 dark:text-ivory-300 uppercase text-xs">
                        {u.subscriptionTier}
                      </td>
                      <td className="px-6 py-4 text-canvas-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="input-field text-xs py-1.5 px-2.5 w-auto cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="artist">Artist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ARTWORKS CATALOG */}
        {activeTab === 'artworks' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-ivory-100 dark:bg-canvas-800 text-canvas-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3">Artwork</th>
                    <th className="px-6 py-3">Artist</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-canvas-800">
                  {artworks.map((a) => (
                    <tr key={a._id}>
                      <td className="px-6 py-4 font-bold text-canvas-900 dark:text-ivory-100">
                        {a.title}
                      </td>
                      <td className="px-6 py-4 text-canvas-600 dark:text-ivory-300">
                        {a.artistName}
                      </td>
                      <td className="px-6 py-4 text-canvas-500">{a.category}</td>
                      <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">${a.price}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          a.isSold ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {a.isSold ? 'Sold' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteArtwork(a._id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-ivory-100 dark:bg-canvas-800 text-canvas-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Buyer / User</th>
                    <th className="px-6 py-3">Item / Tier</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-canvas-800">
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td className="px-6 py-4 font-semibold uppercase text-xs text-brand-500">
                        {t.type}
                      </td>
                      <td className="px-6 py-4 text-canvas-600 dark:text-ivory-300">
                        {t.user?.name || t.userEmail}
                      </td>
                      <td className="px-6 py-4 font-medium text-canvas-900 dark:text-ivory-100">
                        {t.artworkTitle || t.subscriptionTier || 'Subscription'}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">
                        ${t.amount}
                      </td>
                      <td className="px-6 py-4 text-canvas-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
