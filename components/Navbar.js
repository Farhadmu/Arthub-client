'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon, FiChevronDown,
  FiHeart, FiSearch, FiImage, FiGrid
} from 'react-icons/fi';
import SparklesIcon from './SparklesIcon';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import { useTheme } from 'next-themes';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { openCurator, openVisualSearch } = useUI();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setUserDropdown(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Art', path: '/artworks' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'artist') return '/dashboard/artist';
    return '/dashboard/user';
  };

  return (
    <nav className="bg-white/80 dark:bg-canvas-950/85 backdrop-blur-xl border-b border-ivory-200 dark:border-canvas-800/80 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-brand-600 to-gold-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
                <span className="font-display font-black text-xl">A</span>
              </div>
              <div>
                <span className="text-2xl font-display font-extrabold tracking-tight text-canvas-950 dark:text-ivory-100">
                  Art<span className="text-brand-500">Hub</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest font-semibold text-canvas-400 dark:text-ivory-400 -mt-1">
                  AI Art Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Actions: AI Curator & Visual Search buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openVisualSearch}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-ivory-100 dark:bg-canvas-850 hover:bg-ivory-200 dark:hover:bg-canvas-800 text-canvas-700 dark:text-ivory-200 border border-ivory-300 dark:border-canvas-700/60 shadow-xs transition-all hover:scale-[1.02]"
            >
              <FiImage className="text-brand-500" size={15} />
              <span>Visual Search</span>
            </button>

            <button
              onClick={openCurator}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-500/10 via-brand-500/20 to-gold-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 hover:border-brand-500 shadow-sm transition-all hover:scale-[1.02]"
            >
              <SparklesIcon className="text-brand-500 animate-pulse" size={15} />
              <span>ArtHub AI Curator</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200 dark:hover:bg-canvas-800 transition-colors"
              title="Saved Artworks"
            >
              <FiHeart size={19} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* In-app Notifications */}
            {user && <NotificationBell />}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
                className="p-2.5 rounded-xl text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200 dark:hover:bg-canvas-800 transition-colors"
              >
                {theme === 'dark' ? <FiSun size={19} /> : <FiMoon size={19} />}
              </button>
            )}

            {/* User Dropdown / Auth CTAs */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-ivory-300 dark:border-canvas-700 bg-white/70 dark:bg-canvas-850/80 hover:border-brand-500 transition-all"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="text-left hidden xl:block">
                    <span className="text-xs font-semibold text-canvas-900 dark:text-ivory-100 block line-clamp-1">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-brand-500 block -mt-0.5">
                      {user.role}
                    </span>
                  </div>
                  <FiChevronDown size={14} className="text-canvas-400" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-canvas-900 border border-ivory-300 dark:border-canvas-700 rounded-2xl shadow-luxury overflow-hidden py-1.5 z-50 animate-slide-up">
                    <div className="px-4 py-2 border-b border-ivory-200 dark:border-canvas-800">
                      <p className="text-xs font-bold text-canvas-900 dark:text-ivory-100">{user.name}</p>
                      <p className="text-[11px] text-canvas-400 dark:text-canvas-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={getDashboardPath()}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-canvas-700 dark:text-ivory-200 hover:bg-brand-500 hover:text-white transition-colors"
                    >
                      <FiGrid size={15} />
                      <span>Dashboard ({user.role})</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-canvas-700 dark:text-ivory-200 hover:bg-brand-500 hover:text-white transition-colors"
                    >
                      <FiHeart size={15} />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>

                    <div className="border-t border-ivory-200 dark:border-canvas-800 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <FiLogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-canvas-700 dark:text-ivory-200 hover:text-brand-500 px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl text-canvas-600 dark:text-ivory-300"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-canvas-700 dark:text-ivory-200 hover:bg-ivory-200 dark:hover:bg-canvas-800"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-ivory-200 dark:border-canvas-800 space-y-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-ivory-200 dark:border-canvas-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openVisualSearch();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-ivory-100 dark:bg-canvas-800 text-xs font-semibold text-canvas-800 dark:text-ivory-200 border border-ivory-300 dark:border-canvas-700"
              >
                <FiImage className="text-brand-500" />
                <span>Visual Search</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCurator();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-500/30"
              >
                <SparklesIcon className="text-brand-500" />
                <span>AI Curator</span>
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-brand-500 text-white'
                      : 'text-canvas-700 dark:text-ivory-200 hover:bg-ivory-200 dark:hover:bg-canvas-850'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/wishlist"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-canvas-700 dark:text-ivory-200 hover:bg-ivory-200 dark:hover:bg-canvas-850"
              >
                <span className="flex items-center gap-2">
                  <FiHeart size={16} />
                  <span>Wishlist</span>
                </span>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="pt-3 border-t border-ivory-200 dark:border-canvas-800">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={getDashboardPath()}
                    className="btn-secondary w-full text-xs py-2.5"
                  >
                    Go to Dashboard ({user.role})
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-xs font-semibold text-red-500 py-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="btn-secondary flex-1 text-center text-xs py-2.5">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 text-center text-xs py-2.5">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}