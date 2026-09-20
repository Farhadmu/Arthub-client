'use client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { UIProvider } from '@/context/UIContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <WishlistProvider>
          <NotificationProvider>
            <UIProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#141820',
                    color: '#f3efe8',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#e07a5f',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              {children}
            </UIProvider>
          </NotificationProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
