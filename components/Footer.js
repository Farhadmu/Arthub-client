import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-display font-bold">ArtHub</span>
            </div>
            <p className="text-sm opacity-90">
              Discover and buy original art from talented artists around the world.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:opacity-80 transition-opacity">About</Link></li>
              <li><Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link></li>
              <li><Link href="/privacy" className="hover:opacity-80 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:opacity-80 transition-opacity">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/artworks?category=Painting" className="hover:opacity-80 transition-opacity">Painting</Link></li>
              <li><Link href="/artworks?category=Digital" className="hover:opacity-80 transition-opacity">Digital Art</Link></li>
              <li><Link href="/artworks?category=Sculpture" className="hover:opacity-80 transition-opacity">Sculpture</Link></li>
              <li><Link href="/artworks?category=Photography" className="hover:opacity-80 transition-opacity">Photography</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4 opacity-90">Subscribe to get updates on new artworks and artists.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-l-lg focus:outline-none focus:bg-opacity-30 placeholder-white placeholder-opacity-70"
              />
              <button className="px-4 py-2 bg-white text-primary-600 font-medium rounded-r-lg hover:bg-opacity-90 transition-all">
                Subscribe
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/mdfarhadullislamfahim" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><FiFacebook size={20} /></a>
              <a href="https://x.com/MdFarhadul1b" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><FiTwitter size={20} /></a>
              <a href="#" className="hover:opacity-80 transition-opacity"><FiInstagram size={20} /></a>
              <a href="https://github.com/Farhadmu" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><FiGithub size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ArtHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}