'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending - no backend endpoint required for this contact form
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brown-800 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-display font-bold text-brown-800 dark:text-cream-100 mb-3">
            Get in Touch
          </h1>
          <p className="text-brown-500 dark:text-cream-400">
            Have a question, feedback, or just want to say hello? Send us a message below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-brown-700 rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-brown-700 dark:text-cream-300 mb-2">
                Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brown-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-12"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 dark:text-cream-300 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brown-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 dark:text-cream-300 mb-2">
                Message
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute left-4 top-4 text-brown-400" />
                <textarea
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field pl-12 resize-none"
                  placeholder="Write your message..."
                  maxLength={1000}
                />
              </div>
              <p className="text-xs text-brown-400 dark:text-cream-500 mt-1 text-right">
                {formData.message.length}/1000
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3 text-lg disabled:opacity-50"
            >
              <FiSend />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
