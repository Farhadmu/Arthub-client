'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/axios';
import HolographicSeal from '../../../components/HolographicSeal';
import SparklesIcon from '../../../components/SparklesIcon';
import Loading from '../../../components/Loading';
import { FiCheckCircle, FiShield, FiCalendar, FiUser, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

export default function VerifyCertificatePage() {
  const { hash } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verifyHash() {
      if (!hash) return;
      try {
        setLoading(true);
        const res = await api.get(`/certificates/verify/${hash}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate verification failed');
      } finally {
        setLoading(false);
      }
    }

    verifyHash();
  }, [hash]);

  if (loading) return <Loading />;

  const cert = data?.certificate;
  const isVerified = data?.verified;

  return (
    <div className="min-h-screen py-16 px-4 bg-ivory-50 dark:bg-canvas-950">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-canvas-500 hover:text-canvas-900 dark:hover:text-white mb-8 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to ArtHub Marketplace</span>
        </Link>

        {isVerified && cert ? (
          <div className="bg-white dark:bg-canvas-900 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Status Banner */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-semibold w-fit mb-6">
              <FiCheckCircle className="w-4 h-4" />
              <span>OFFICIALLY VERIFIED ON ARTHUB REGISTRY</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-ivory-200 dark:border-canvas-800">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-canvas-950 dark:text-ivory-50">
                  {cert.artworkTitle}
                </h1>
                <p className="text-sm text-canvas-500 dark:text-ivory-300 mt-1">
                  Masterwork by <strong className="text-brand-600 dark:text-brand-400">{cert.artistName}</strong>
                </p>
              </div>

              <HolographicSeal size="sm" editionNumber={cert.editionNumber} />
            </div>

            {/* Artwork Preview Image if available */}
            {cert.artwork?.image && (
              <div className="my-6 rounded-2xl overflow-hidden border border-ivory-300 dark:border-canvas-800 max-h-72">
                <img
                  src={cert.artwork.image}
                  alt={cert.artworkTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Provenance Details */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div className="space-y-1">
                <span className="text-canvas-400 uppercase text-[10px] tracking-wider block">Medium</span>
                <span className="font-semibold text-canvas-800 dark:text-ivory-100">{cert.medium}</span>
              </div>
              <div className="space-y-1">
                <span className="text-canvas-400 uppercase text-[10px] tracking-wider block">Edition</span>
                <span className="font-semibold text-canvas-800 dark:text-ivory-100">{cert.editionNumber}</span>
              </div>
              <div className="space-y-1">
                <span className="text-canvas-400 uppercase text-[10px] tracking-wider block">Certified Collector</span>
                <span className="font-semibold text-canvas-800 dark:text-ivory-100">{cert.buyerName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-canvas-400 uppercase text-[10px] tracking-wider block">Date Registered</span>
                <span className="font-semibold text-canvas-800 dark:text-ivory-100">
                  {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Hash Display */}
            <div className="mt-6 pt-4 border-t border-ivory-200 dark:border-canvas-800">
              <span className="text-[10px] uppercase tracking-wider text-canvas-400 block mb-1">
                SHA-256 Provenance Hash
              </span>
              <p className="font-mono text-xs text-canvas-600 dark:text-ivory-300 bg-canvas-100 dark:bg-canvas-950 p-3 rounded-xl break-all border border-ivory-200 dark:border-canvas-800">
                {cert.verificationHash}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-canvas-900 border border-red-500/30 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <FiAlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-xl font-bold text-canvas-900 dark:text-ivory-100">
              Certificate Not Found
            </h2>
            <p className="text-xs text-canvas-500 dark:text-ivory-400 max-w-sm mx-auto">
              {error || 'No valid Certificate of Authenticity was found matching this hash. The artwork may be uncertified or the link is invalid.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
