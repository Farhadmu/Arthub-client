'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const token = response.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const user = await googleLogin({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        picture: payload.picture,
      });

      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'artist') router.push('/dashboard/artist');
      else router.push('/');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleGoogleClick = () => {
    if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google Sign-In not configured');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'artist') router.push('/dashboard/artist');
      else router.push('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Artistic Background */}
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-12"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-brown-800/80" />
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <span className="text-3xl font-display font-bold">ArtHub</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Welcome Back to the Gallery</h1>
          <p className="text-lg opacity-90 mb-8">Your collection, your favorites, your story — all waiting for you.</p>
          
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream-100 dark:bg-brown-800">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-brown-800 dark:text-cream-100 mb-2">Sign In</h2>
            <p className="text-brown-500 dark:text-cream-400">Welcome back to the marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-brown-700 dark:text-cream-300 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brown-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 dark:text-cream-300 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brown-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brown-300 dark:border-brown-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-cream-100 dark:bg-brown-800 text-brown-500 dark:text-cream-400 text-sm font-semibold">OR</span>
            </div>
          </div>

          <button
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center space-x-3 border-2 border-brown-300 dark:border-brown-600 rounded-lg py-3 px-4 hover:bg-cream-200 dark:hover:bg-brown-700 transition-colors"
          >
            <FcGoogle size={24} />
            <span className="font-medium text-brown-700 dark:text-cream-200">Continue with Google</span>
          </button>

          <div className="mt-8 text-center">
            <p className="text-brown-600 dark:text-cream-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}