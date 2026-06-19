'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Artworks', path: '/artworks' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'artist') return '/dashboard/artist';
    return '/dashboard/user';
  };

  return (
    <nav className="bg-cream-100 dark:bg-brown-800 border-b border-cream-300 dark:border-brown-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-display font-bold text-brown-800 dark:text-cream-100">
                ArtHub
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <Link
                href={getDashboardPath()}
                className={`nav-link flex items-center space-x-1 ${pathname?.startsWith('/dashboard') ? 'nav-link-active' : ''}`}
              >
                <span>Dashboard</span>
                <FiChevronDown size={14} />
              </Link>
            )}

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-brown-700 transition-colors"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-cream-300 dark:border-brown-600">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">{user.name[0]}</span>
                    </div>
                  )}
                  <span className="font-medium text-brown-700 dark:text-cream-200">{user.name}</span>
                  <FiChevronDown size={14} className="text-brown-500" />
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="nav-link">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-brown-700"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-cream-100 dark:bg-brown-800 border-t border-cream-300 dark:border-brown-700">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <Link
                href={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className={`block nav-link ${pathname?.startsWith('/dashboard') ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </Link>
            )}

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center space-x-2 nav-link w-full"
              >
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            )}

            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">{user.name[0]}</span>
                    </div>
                  )}
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 w-full"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block nav-link text-center py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block btn-primary text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}