'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import { ArtworkCardSkeleton } from '@/components/Loading';
import api from '@/lib/axios';
import { FiArrowRight, FiAward, FiUsers, FiImage, FiDollarSign, FiStar, FiCheck } from 'react-icons/fi';

export default function HomePage() {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksRes, artistsRes] = await Promise.all([
          api.get('/artworks/featured'),
          api.get('/artworks/top-artists'),
        ]);
        setFeaturedArtworks(artworksRes.data);
        setTopArtists(artistsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Watercolor', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', count: 3 },
    { name: 'Digital', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', count: 3 },
    { name: 'Painting', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80', count: 3 },
    { name: 'Abstract', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', count: 2 },
    { name: 'Sculpture', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', count: 1 },
  ];

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&q=80',
      title: 'Art for Every Space',
      subtitle: 'Paintings, digital art, watercolors and sculptures — curated for collectors who care.',
    },
    {
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&q=80',
      title: 'Discover Unique Creations',
      subtitle: 'Connect directly with artists and find pieces that speak to your soul.',
    },
    {
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1920&q=80',
      title: 'Support Artists Worldwide',
      subtitle: 'Every purchase helps artists continue their creative journey.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800">
      <section className="relative h-[600px]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-brown-800 bg-opacity-50" />
                <div className="relative h-full flex items-center justify-start px-8 md:px-16 lg:px-24">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <div className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      ONLINE ART MARKETPLACE
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-cream-200 mb-8">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/artworks" className="btn-primary text-center">
                        Browse Artworks
                      </Link>
                      <Link href="/register" className="btn-secondary text-center">
                        Join as Artist
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="py-16 bg-cream-100 dark:bg-brown-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100 mb-2">Featured Artworks</h2>
              <p className="text-brown-500 dark:text-cream-400">Handpicked pieces from our latest collection</p>
            </div>
            <Link href="/artworks" className="btn-outline hidden md:inline-flex items-center space-x-2">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ArtworkCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArtworkCard artwork={artwork} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/artworks" className="btn-outline inline-flex items-center space-x-2">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream-100 dark:bg-brown-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100 mb-2">Top Artists</h2>
            <p className="text-brown-500 dark:text-cream-400">Our most celebrated creators</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topArtists.length > 0 ? (
              topArtists.map((artist, index) => (
                <motion.div
                  key={artist._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8 text-center"
                >
                  <div className="relative inline-block mb-4">
                    {artist.avatar ? (
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-display font-bold">
                        {artist.name[0]}
                      </div>
                    )}
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                        <FiStar size={16} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-brown-800 dark:text-cream-100 mb-2">{artist.name}</h3>
                  <p className="text-brown-500 dark:text-cream-400 mb-2">{artist.count} sales</p>
                  <p className="text-primary-600 font-bold text-lg mb-4">${artist.totalSales?.toFixed(2) || '0.00'} total</p>
                  <div className="inline-block px-4 py-2 border border-brown-300 dark:border-brown-600 rounded-full text-sm font-medium text-brown-700 dark:text-cream-300">
                    {index === 0 ? 'Top Seller' : index === 1 ? 'Featured Artist' : 'Rising Star'}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-brown-500 dark:text-cream-400">No artists yet. Be the first to join!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream-100 dark:bg-brown-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100 mb-2">Browse by Category</h2>
            <p className="text-brown-500 dark:text-cream-400">Explore art across every medium and style</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/artworks?category=${category.name}`}
                  className="relative block rounded-xl overflow-hidden aspect-square group"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-white text-sm opacity-90">{category.count} works</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}