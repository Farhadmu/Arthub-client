import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleSignInScript from '@/components/GoogleSignInScript';
import './globals.css';

export const metadata = {
  title: 'ArtHub - Online Art Marketplace',
  description: 'Discover and buy original art from talented artists around the world',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://accounts.google.com" />
      </head>
      <body>
        <GoogleSignInScript />
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}