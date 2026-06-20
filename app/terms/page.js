'use client';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content:
        'By creating an account or using ArtHub, you agree to these Terms of Service. If you do not agree, please do not use the platform.',
    },
    {
      title: '2. Accounts & Roles',
      content:
        'ArtHub supports three account types: User, Artist, and Admin. Users can browse and purchase artwork. Artists can upload, edit, and sell their own original artwork. Admins manage the platform. You are responsible for maintaining the confidentiality of your account credentials.',
    },
    {
      title: '3. Artwork Listings',
      content:
        'Artists confirm that any artwork uploaded to ArtHub is their own original work and that they hold the rights to sell it. ArtHub reserves the right to remove any listing that violates these terms or applicable law.',
    },
    {
      title: '4. Purchases & Payments',
      content:
        'All purchases are processed through Stripe. Once an artwork is purchased, it is marked as sold and is no longer available to other buyers. Subscription plans (Free, Pro, Premium) determine the number of artworks a user may purchase and renew automatically unless cancelled.',
    },
    {
      title: '5. Comments & Conduct',
      content:
        'Only users who have purchased an artwork may leave a comment on it. Comments must be respectful and relevant. ArtHub reserves the right to remove comments that violate community standards.',
    },
    {
      title: '6. Refunds',
      content:
        'Due to the nature of digital art marketplace transactions, purchases are generally final. If you believe there has been an error with your purchase, please contact us for assistance.',
    },
    {
      title: '7. Limitation of Liability',
      content:
        'ArtHub is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
    },
    {
      title: '8. Changes to These Terms',
      content:
        'We may revise these Terms of Service from time to time. Continued use of ArtHub after changes are posted constitutes acceptance of the revised terms.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100 mb-3">
            Terms of Service
          </h1>
          <p className="text-brown-500 dark:text-cream-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <div className="bg-white dark:bg-brown-700 rounded-xl shadow-lg p-8 space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-xl font-semibold text-brown-800 dark:text-cream-100 mb-2">
                {section.title}
              </h2>
              <p className="text-brown-600 dark:text-cream-300 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
