'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiHeart, FiShoppingBag, FiArrowRight, FiRotateCcw } from 'react-icons/fi';
import SparklesIcon from './SparklesIcon';
import { useUI } from '@/context/UIContext';
import { useWishlist } from '@/context/WishlistContext';
import api from '@/lib/axios';

const SUGGESTED_PROMPTS = [
  'Peaceful artwork for my bedroom under $150',
  'Abstract blue digital compositions',
  'Vibrant modern landscape paintings',
  'Minimalist contemporary art for living room'
];

export default function ArtHubAICurator() {
  const { isCuratorOpen, closeCurator } = useUI();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Greetings! I'm ArtHub AI, your personal fine art curator. Tell me what mood, room, color, or budget you have in mind, and I'll find genuine original pieces from our artist community.",
      artworks: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCuratorOpen) {
      scrollToBottom();
    }
  }, [messages, isCuratorOpen]);

  const handleSend = async (queryText) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.text }));
      const { data } = await api.post('/ai/assistant/chat', {
        message: text.trim(),
        history: historyPayload
      });

      const assistantMessage = {
        role: 'assistant',
        text: data.reply,
        artworks: data.recommendedArtworks || []
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I'm momentarily re-indexing the gallery. Let me present some of our most celebrated works in the meantime.",
          artworks: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        text: "Curator session reset. How can I assist your artistic journey today?",
        artworks: []
      }
    ]);
  };

  return (
    <AnimatePresence>
      {isCuratorOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCurator}
            className="fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-canvas-900 border-l border-ivory-300 dark:border-canvas-700 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-ivory-200 dark:border-canvas-700 flex items-center justify-between bg-ivory-50 dark:bg-canvas-850">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-brand-600 to-gold-500 flex items-center justify-center text-white shadow-glow">
                  <SparklesIcon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-lg text-canvas-900 dark:text-ivory-100">
                      ArtHub AI
                    </h2>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-500/15 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-500/20">
                      Curator
                    </span>
                  </div>
                  <p className="text-xs text-canvas-500 dark:text-ivory-400">
                    Real-time conversational gallery advisor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="p-2 text-canvas-400 hover:text-canvas-700 dark:hover:text-ivory-200 rounded-lg hover:bg-ivory-200 dark:hover:bg-canvas-700 transition-colors"
                >
                  <FiRotateCcw size={16} />
                </button>
                <button
                  onClick={closeCurator}
                  className="p-2 text-canvas-400 hover:text-canvas-700 dark:hover:text-ivory-200 rounded-lg hover:bg-ivory-200 dark:hover:bg-canvas-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Prompt Chips */}
            <div className="px-4 py-2.5 bg-ivory-100/70 dark:bg-canvas-800/60 border-b border-ivory-200 dark:border-canvas-700/50 overflow-x-auto flex gap-2 no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap text-xs bg-white dark:bg-canvas-700 hover:border-brand-500 text-canvas-700 dark:text-ivory-200 px-3 py-1.5 rounded-full border border-ivory-300 dark:border-canvas-600 shadow-sm transition-all hover:scale-[1.02] flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-ivory-100 dark:bg-canvas-800 text-canvas-800 dark:text-ivory-100 border border-ivory-200 dark:border-canvas-700 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Artwork Cards Recommendation in Response */}
                  {msg.artworks && msg.artworks.length > 0 && (
                    <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.artworks.map((art) => (
                        <div
                          key={art._id}
                          className="bg-white dark:bg-canvas-850 border border-ivory-200 dark:border-canvas-700 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                        >
                          <div className="relative aspect-video overflow-hidden bg-ivory-200 dark:bg-canvas-800">
                            <img
                              src={art.image}
                              alt={art.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-canvas-950/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                              {art.category}
                            </div>
                            <button
                              onClick={() => toggleWishlist(art)}
                              className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md ${
                                isWishlisted(art._id) ? 'bg-red-500 text-white' : 'bg-black/40 text-white'
                              }`}
                            >
                              <FiHeart size={13} className={isWishlisted(art._id) ? 'fill-current' : ''} />
                            </button>
                          </div>

                          <div className="p-2.5">
                            <h4 className="font-display font-semibold text-xs text-canvas-900 dark:text-ivory-100 line-clamp-1">
                              {art.title}
                            </h4>
                            <p className="text-[11px] text-canvas-500 dark:text-ivory-400 line-clamp-1">
                              by {art.artistName || art.artist?.name}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                                ${art.price}
                              </span>
                              <Link
                                href={`/artworks/${art._id}`}
                                onClick={closeCurator}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                              >
                                <span>View</span>
                                <FiArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-xs text-canvas-500 dark:text-ivory-400 py-2">
                  <div className="w-5 h-5 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
                  <span>ArtHub AI is curating recommendations from the collection...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 sm:p-4 border-t border-ivory-200 dark:border-canvas-700 bg-ivory-50 dark:bg-canvas-850"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for recommendations, moods, or budgets..."
                  disabled={loading}
                  className="w-full bg-white dark:bg-canvas-800 border border-ivory-300 dark:border-canvas-700 rounded-xl py-3 pl-4 pr-12 text-sm text-canvas-900 dark:text-ivory-100 placeholder:text-canvas-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg disabled:opacity-40 transition-all active:scale-95"
                >
                  <FiSend size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
