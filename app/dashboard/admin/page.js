'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import { FiUsers, FiImage, FiDollarSign, FiTrendingUp, FiTrash2 } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const CHART_COLORS = ['#c4431f', '#e8a838', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (authLoading) return; // wait until auth state is resolved (prevents false redirect on reload)
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [usersRes, artworksRes, transactionsRes, analyticsRes] = await Promise.all([
        api.get('/users'),
        api.get('/artworks/admin/all'),
        api.get('/transactions/all'),
        api.get('/transactions/analytics'),
      ]);
      setUsers(usersRes.data);
      setArtworks(artworksRes.data.artworks || []);
      setTransactions(transactionsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteArtwork = async (id) => {
    if (!confirm('Delete this artwork? This action cannot be undone.')) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success('Artwork deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete artwork');
    }
  };

  if (authLoading || !user || loading) return <Loading fullScreen />;

  const pieData = analytics?.salesByCategory?.map((item) => ({
    name: item._id || 'Unknown',
    value: item.count,
  })) || [];

  const barData = analytics?.monthlySales?.map((item) => ({
    month: item._id,
    revenue: parseFloat(item.total.toFixed(2)),
    sales: item.count,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-8 text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total Users',
                value: analytics.totalUsers,
                icon: <FiUsers size={28} />,
                color: 'text-primary-600',
                bg: 'bg-primary-50 dark:bg-primary-900/20',
              },
              {
                label: 'Total Artists',
                value: analytics.totalArtists,
                icon: <FiImage size={28} />,
                color: 'text-accent-500',
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
              },
              {
                label: 'Artworks Sold',
                value: analytics.totalArtworksSold,
                icon: <FiTrendingUp size={28} />,
                color: 'text-green-600',
                bg: 'bg-green-50 dark:bg-green-900/20',
              },
              {
                label: 'Total Revenue',
                value: `$${analytics.totalRevenue.toFixed(2)}`,
                icon: <FiDollarSign size={28} />,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
              },
            ].map((card) => (
              <div
                key={card.label}
                className={`${card.bg} rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  </div>
                  <div className={card.color}>{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: FiTrendingUp },
            { id: 'users', label: `Users (${users.length})`, icon: FiUsers },
            { id: 'artworks', label: `Artworks (${artworks.length})`, icon: FiImage },
            { id: 'transactions', label: `Transactions (${transactions.length})`, icon: FiDollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-5 font-medium transition-colors whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview — Charts */}
        {activeTab === 'overview' && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Revenue Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Monthly Revenue
              </h2>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(v) => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${value}` : value,
                        name === 'revenue' ? 'Revenue' : 'Sales',
                      ]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="revenue" fill="#c4431f" radius={[4, 4, 0, 0]} name="revenue" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  No revenue data yet
                </div>
              )}
            </div>

            {/* Sales by Category Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Sales by Category
              </h2>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Sales']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  No category data yet
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Platform Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: 'Total Artworks Listed', value: artworks.length },
                  { label: 'Total Transactions', value: transactions.length },
                  { label: 'Active Users', value: users.filter(u => u.role === 'user').length },
                  { label: 'Active Artists', value: users.filter(u => u.role === 'artist').length },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-2xl font-bold text-primary-600">{s.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manage Users */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Change Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold text-sm">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : u.role === 'artist'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user._id}
                          className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Manage Artworks */}
        {activeTab === 'artworks' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Artwork
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Artist
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {artworks.map((artwork) => (
                    <tr key={artwork._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {artwork.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{artwork.artistName}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        ${artwork.price}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          artwork.isSold
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : artwork.isPublished
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {artwork.isSold ? 'Sold' : artwork.isPublished ? 'Published' : 'Unpublished'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteArtwork(artwork._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                          title="Delete artwork"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {artworks.length === 0 && (
                <div className="text-center py-12 text-gray-400">No artworks found</div>
              )}
            </div>
          </div>
        )}

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-4 px-6 font-mono text-xs text-gray-500 dark:text-gray-400">
                        #{t._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          t.type === 'purchase'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">{t.userEmail}</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {t.type === 'purchase' ? t.artworkTitle : `${t.subscriptionTier} plan`}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        ${t.amount}
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(t.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="text-center py-12 text-gray-400">No transactions yet</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
