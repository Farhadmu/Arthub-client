'use client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <Toaster position="top-center" />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
