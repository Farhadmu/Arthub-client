'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiTwitter, FiInstagram, FiGithub, FiImage, FiArrowRight, FiCheck } from 'react-icons/fi';
import SparklesIcon from './SparklesIcon';
import { useUI } from '@/context/UIContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { openCurator, openVisualSearch } = useUI();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    toast.success("Welcome to ArtHub Gazette! You'll receive our weekly curated drops.");
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-canvas-950 text-ivory-300 border-t border-canvas-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-brand-600 to-gold-500 flex items-center justify-center text-white shadow-glow">
                <span className="font-display font-black text-xl">A</span>
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight text-white">
                Art<span className="text-brand-500">Hub</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-canvas-400 max-w-sm leading-relaxed">
              The premier AI-powered art marketplace connecting collectors with verified original creators worldwide through intelligent curation and visual search.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-canvas-900 hover:bg-brand-500 hover:text-white transition-colors text-canvas-400">
                <FiTwitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-canvas-900 hover:bg-brand-500 hover:text-white transition-colors text-canvas-400">
                <FiInstagram size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-canvas-900 hover:bg-brand-500 hover:text-white transition-colors text-canvas-400">
                <FiGithub size={16} />
              </a>
            </div>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4">AI Innovation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={openCurator} className="hover:text-brand-400 flex items-center gap-1.5 transition-colors">
                  <SparklesIcon className="text-brand-500" />
                  <span>ArtHub AI Curator</span>
                </button>
              </li>
              <li>
                <button onClick={openVisualSearch} className="hover:text-brand-400 flex items-center gap-1.5 transition-colors">
                  <FiImage className="text-brand-500" />
                  <span>Visual Image Search</span>
                </button>
              </li>
              <li>
                <Link href="/artworks" className="hover:text-brand-400 transition-colors">
                  Smart Natural Search
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-400 transition-colors">
                  Artist AI Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Curated Mediums */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4">Fine Art Mediums</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/artworks?category=Painting" className="hover:text-brand-400 transition-colors">Paintings</Link></li>
              <li><Link href="/artworks?category=Digital" className="hover:text-brand-400 transition-colors">Digital Compositions</Link></li>
              <li><Link href="/artworks?category=Sculpture" className="hover:text-brand-400 transition-colors">Sculptures & 3D</Link></li>
              <li><Link href="/artworks?category=Photography" className="hover:text-brand-400 transition-colors">Photography</Link></li>
              <li><Link href="/artworks?category=Illustration" className="hover:text-brand-400 transition-colors">Illustrations</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4">ArtHub Gazette</h4>
            <p className="text-xs text-canvas-400 mb-3">
              Receive weekly curated exhibitions, new artist debuts, and market trends.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="curator@gallery.com"
                className="w-full bg-canvas-900 border border-canvas-750 text-white placeholder:text-canvas-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="w-full btn-primary text-xs py-2.5 justify-center"
              >
                <span>{subscribed ? 'Subscribed' : 'Join Gazette'}</span>
                {subscribed ? <FiCheck /> : <FiArrowRight />}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-canvas-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-canvas-500">
          <p>© {new Date().getFullYear()} ArtHub Inc. All Rights Reserved. Empowering artists worldwide.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-brand-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-brand-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
