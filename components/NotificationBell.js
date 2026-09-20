'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiBell, FiCheck, FiShoppingBag, FiDollarSign, FiMessageCircle, FiStar, FiAlertCircle } from 'react-icons/fi';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'PURCHASE_SUCCESS':
        return <FiShoppingBag className="text-brand-500" size={16} />;
      case 'ARTWORK_SOLD':
        return <FiDollarSign className="text-emerald-500" size={16} />;
      case 'NEW_COMMENT':
        return <FiMessageCircle className="text-blue-500" size={16} />;
      case 'SUBSCRIPTION_UPDATE':
        return <FiStar className="text-gold-500" size={16} />;
      default:
        return <FiAlertCircle className="text-brand-500" size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2.5 rounded-xl text-canvas-600 dark:text-ivory-300 hover:bg-ivory-200 dark:hover:bg-canvas-800 transition-colors"
      >
        <FiBell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-500 text-white text-[10px] font-bold rounded-full px-1 shadow-glow animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-canvas-900 border border-ivory-300 dark:border-canvas-700 rounded-2xl shadow-luxury overflow-hidden z-50 animate-slide-up">
          <div className="p-3.5 px-4 border-b border-ivory-200 dark:border-canvas-750 flex items-center justify-between bg-ivory-50 dark:bg-canvas-850">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-canvas-900 dark:text-ivory-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-brand-500/15 text-brand-600 dark:text-brand-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-ivory-200 dark:divide-canvas-800">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.link || '#'}
                  onClick={() => {
                    markAsRead(n._id);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 flex gap-3 items-start transition-colors ${
                    n.read
                      ? 'bg-transparent hover:bg-ivory-100 dark:hover:bg-canvas-800/60'
                      : 'bg-brand-500/5 dark:bg-brand-500/10 hover:bg-brand-500/10 dark:hover:bg-brand-500/15'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-canvas-800 border border-ivory-200 dark:border-canvas-700 shadow-xs mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-xs ${n.read ? 'font-medium text-canvas-800 dark:text-ivory-200' : 'font-bold text-canvas-950 dark:text-white'}`}>
                      {n.title}
                    </h5>
                    <p className="text-xs text-canvas-500 dark:text-ivory-400 line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-canvas-400 dark:text-canvas-500 mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-canvas-400 dark:text-canvas-500 text-xs">
                No notifications yet. You'll receive updates on your purchases, sales, and saved artworks here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
