import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleSignInScript from '@/components/GoogleSignInScript';
import ArtHubAICurator from '@/components/ArtHubAICurator';
import VisualSearchModal from '@/components/VisualSearchModal';
import './globals.css';

export const metadata = {
  title: 'ArtHub — AI-Powered Digital & Fine Art Marketplace',
  description: 'Discover, collect, and buy original artwork with intelligent AI art curation, visual similarity search, and automated artist tools.',
  keywords: ['art marketplace', 'AI art curator', 'visual search artwork', 'buy paintings', 'digital art collectors'],
  openGraph: {
    title: 'ArtHub — The Intelligent Art Marketplace',
    description: 'An AI-powered digital art marketplace where collectors discover, purchase, and interact with artwork.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://accounts.google.com" />
      </head>
      <body className="bg-ivory-50 dark:bg-canvas-950 text-canvas-900 dark:text-ivory-100 min-h-screen flex flex-col">
        <GoogleSignInScript />
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          {/* Global AI Modals */}
          <ArtHubAICurator />
          <VisualSearchModal />
        </Providers>
      </body>
    </html>
  );
}