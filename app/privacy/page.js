'use client';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content:
        'When you use ArtHub, we collect information you provide directly, such as your name, email address, and profile details when you register or sign in with Google. We also collect information about the artworks you browse, purchase, or upload, as well as basic usage data to help us improve the platform.',
    },
    {
      title: '2. How We Use Your Information',
      content:
        'We use your information to operate and improve ArtHub, process purchases and subscriptions, communicate with you about your account or transactions, and keep the platform secure. We do not sell your personal information to third parties.',
    },
    {
      title: '3. Payment Information',
      content:
        'All payments on ArtHub are processed securely through Stripe. We do not store your card details on our servers — Stripe handles all sensitive payment data in accordance with industry security standards.',
    },
    {
      title: '4. Cookies & Authentication',
      content:
        'ArtHub uses cookies and similar technologies to keep you signed in and to remember your preferences, such as dark mode. If you sign in with Google, we receive basic profile information (name, email, and profile picture) as permitted by your Google account settings.',
    },
    {
      title: '5. Data Sharing',
      content:
        'We only share your information with third-party services necessary to operate ArtHub, such as our payment processor (Stripe) and image hosting provider. These providers are bound by their own privacy and security obligations.',
    },
    {
      title: '6. Your Rights',
      content:
        'You can update your profile information at any time from your dashboard. If you wish to delete your account or have questions about your data, please reach out to us through the Contact page.',
    },
    {
      title: '7. Changes to This Policy',
      content:
        'We may update this Privacy Policy from time to time. Continued use of ArtHub after changes are posted constitutes acceptance of the revised policy.',
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
            Privacy Policy
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
