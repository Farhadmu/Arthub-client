'use client';
import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  const values = [
    {
      icon: <FiHeart size={28} />,
      title: 'Passion for Art',
      description: 'We believe every piece of art tells a story. ArtHub exists to connect that story with people who will cherish it.',
    },
    {
      icon: <FiUsers size={28} />,
      title: 'Supporting Artists',
      description: 'We help independent artists reach a global audience and earn a fair living from their craft.',
    },
    {
      icon: <FiShield size={28} />,
      title: 'Safe & Secure',
      description: 'Every transaction on ArtHub is protected, so buyers and artists can trade with complete confidence.',
    },
    {
      icon: <FiTrendingUp size={28} />,
      title: 'Growing Community',
      description: 'From watercolor to digital art, our marketplace keeps growing with talented creators every day.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800">
      {/* Hero */}
      <div className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-bold mb-4"
          >
            About ArtHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg opacity-90 max-w-2xl mx-auto"
          >
            A home for original art and the people who create it.
          </motion.p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose dark:prose-invert max-w-none"
        >
          <h2 className="text-3xl font-display font-bold text-brown-800 dark:text-cream-100 mb-4">
            Our Story
          </h2>
          <p className="text-brown-600 dark:text-cream-300 leading-relaxed mb-4">
            ArtHub started with a simple idea: talented artists deserve a straightforward way to
            share their work with the world, and art lovers deserve an easy way to discover pieces
            that speak to them. What began as a small marketplace has grown into a vibrant community
            of painters, photographers, sculptors, and digital creators.
          </p>
          <p className="text-brown-600 dark:text-cream-300 leading-relaxed">
            Today, ArtHub connects buyers and artists across the globe, making it simple to browse,
            collect, and own original artwork — all in one trusted place.
          </p>
        </motion.div>
      </div>

      {/* Values Grid */}
      <div className="bg-white dark:bg-brown-700 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-brown-800 dark:text-cream-100 mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-brown-800 dark:text-cream-100 mb-2">{value.title}</h3>
                <p className="text-sm text-brown-500 dark:text-cream-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-display font-bold text-brown-800 dark:text-cream-100 mb-4">
          Join the ArtHub Community
        </h2>
        <p className="text-brown-500 dark:text-cream-400 mb-8 max-w-xl mx-auto">
          Whether you're here to collect or to create, there's a place for you at ArtHub.
        </p>
        <a href="/artworks" className="btn-primary inline-block px-8 py-3">
          Explore Artworks
        </a>
      </div>
    </div>
  );
}
