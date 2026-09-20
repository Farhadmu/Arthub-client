'use client';

import { useState, useEffect, useRef } from 'react';
import api from '../lib/axios';
import SparklesIcon from './SparklesIcon';
import WaveformVisualizer from './WaveformVisualizer';
import { FiPlay, FiPause, FiRotateCcw, FiVolume2, FiVolumeX, FiList } from 'react-icons/fi';

export default function AudioGuidePlayer({ artworkId, artworkTitle, artistName }) {
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    async function loadAudioGuide() {
      if (!artworkId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/ai/audio-guide/${artworkId}`);
        setNarrative(data);
      } catch (err) {
        // Fallback default narrative
        setNarrative({
          title: artworkTitle || 'Artwork Masterpiece',
          artistName: artistName || 'Featured Artist',
          fullText: `Welcome to the ArtHub Audio Gallery. Before you stands "${artworkTitle || 'this masterpiece'}", an evocative exploration of texture and light created by ${artistName || 'the artist'}. Observe how the brushwork creates depth and harmony across the canvas.`,
          durationSeconds: 45,
          sections: [
            { id: 1, title: 'Introduction', text: `Welcome to the ArtHub Audio Gallery. You are exploring "${artworkTitle}" by ${artistName}.` },
            { id: 2, title: 'Composition & Mood', text: 'Notice the deliberate tonal contrast and balance inviting quiet contemplation.' }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    loadAudioGuide();

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [artworkId, artworkTitle, artistName]);

  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel();
        const textToSpeak = narrative?.fullText || '';
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.92; // Museum curator deliberate pacing
        utterance.pitch = 1.0;

        // Try to pick an English voice
        const voices = window.speechSynthesis.getVoices();
        const curatorVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha')));
        if (curatorVoice) utterance.voice = curatorVoice;

        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentSectionIndex(0);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSectionIndex(0);
      handlePlayPause();
    }
  };

  const handleToggleMute = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (!isMuted) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsMuted(true);
      } else {
        setIsMuted(false);
        handlePlayPause();
      }
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-gradient-to-r from-canvas-900 via-canvas-850 to-canvas-900 border border-gold-500/30 shadow-luxury text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Curator Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0">
            <SparklesIcon className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                AI Museum Audio Guide
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-ivory-200">
                ~{narrative?.durationSeconds || 45}s
              </span>
            </div>
            <h4 className="text-sm font-medium text-ivory-100 line-clamp-1">
              Curator Narrative: {narrative?.title || artworkTitle}
            </h4>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePlayPause}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs shadow-glow transition-all active:scale-95 disabled:opacity-50"
          >
            {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Guide' : 'Listen to Story'}</span>
          </button>

          <button
            onClick={handleRestart}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory-200 hover:text-white transition-colors"
            title="Restart Narrative"
          >
            <FiRotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`p-2 rounded-xl border transition-colors ${
              showTranscript ? 'bg-gold-500/20 text-gold-400 border-gold-500/50' : 'bg-white/5 border-transparent text-ivory-200 hover:bg-white/10'
            }`}
            title="View Curator Transcript"
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Audio Waveform */}
      <div className="pt-2">
        <WaveformVisualizer isPlaying={isPlaying} />
      </div>

      {/* Transcript Drawer */}
      {showTranscript && narrative && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs text-ivory-300 animate-slide-up">
          <p className="font-semibold text-gold-400 uppercase tracking-widest text-[10px]">
            Curator Transcript
          </p>
          {narrative.sections?.map((sec, idx) => (
            <div key={sec.id || idx} className="p-2.5 rounded-lg bg-black/20 border border-white/5 space-y-1">
              <span className="font-semibold text-white/90 text-[11px] block">
                {sec.title}
              </span>
              <p className="text-canvas-300 leading-relaxed font-serif">
                {sec.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
