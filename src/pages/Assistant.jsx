import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiRecommend } from '../lib/api';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import GlowButton from '../components/GlowButton';
import { SkeletonCard } from '../components/Skeleton';
import {
  RiChat3Line, RiSendPlaneLine, RiFilmLine,
  RiLoader4Line, RiSparklingLine
} from 'react-icons/ri';

const QUICK_PROMPTS = [
  { text: "What should I watch tonight?", mood: 'popular', icon: '🌙' },
  { text: "Recommend something mind-bending", mood: 'mind-bending', icon: '🌀' },
  { text: "I want emotional sci-fi films", mood: 'sci-fi', icon: '🚀' },
  { text: "Something that'll make me cry", mood: 'emotional', icon: '💧' },
  { text: "A feel-good comedy", mood: 'feel-good', icon: '😄' },
  { text: "Dark psychological thriller", mood: 'dark', icon: '🔮' },
  { text: "Epic adventure films", mood: 'adventure', icon: '⚔️' },
  { text: "A romantic evening film", mood: 'romantic', icon: '🌹' },
];

const AI_RESPONSES = {
  'mind-bending': "These films will unravel the fabric of your reality — prepare for a journey into the depths of perception and consciousness.",
  'emotional': "Cinema's greatest power is making us feel. These films will reach into your soul and leave an indelible mark.",
  'feel-good': "Sometimes you need film as a warm embrace. These selections radiate joy and leave you smiling long after the credits roll.",
  'thriller': "Buckle in. These films will keep you on the edge of your seat, pulse racing, second-guessing every frame.",
  'adventure': "Your passport to extraordinary worlds. These epics will take you beyond the horizon and into the realm of legend.",
  'dark': "For those who dare to look into the abyss. These films explore the shadowed corners of the human psyche.",
  'romantic': "Love, beautifully captured. These films celebrate connection, longing, and the tender complexity of the human heart.",
  'sci-fi': "The cosmos of human imagination, rendered on screen. These films explore what it means to exist in an infinite universe.",
  'comedy': "Laughter is the best medicine — and these films are a full prescription. Pure, unadulterated joy awaits.",
  'documentary': "Truth is stranger than fiction. These documentaries illuminate worlds, stories, and lives that will expand your understanding.",
  'animated': "Animation transcends age and reality. These films carry profound emotional depth wrapped in visual wonder.",
  'classic': "The pillars of cinema. These timeless masterworks shaped the art form and continue to resonate across generations.",
  'popular': "Based on what's captivating audiences right now, here are some films that have been lighting up screens and conversations everywhere.",
};

const MOOD_DETECT = [
  { keywords: ['mind-bending', 'complex', 'deep', 'philosophical', 'confusing', 'twist', 'reality'], mood: 'mind-bending' },
  { keywords: ['cry', 'emotional', 'sad', 'moving', 'touching', 'heartfelt', 'drama'], mood: 'emotional' },
  { keywords: ['laugh', 'comedy', 'funny', 'humor', 'fun'], mood: 'feel-good' },
  { keywords: ['scared', 'horror', 'thriller', 'suspense', 'mystery', 'dark'], mood: 'dark' },
  { keywords: ['sci-fi', 'science', 'space', 'future', 'technology', 'robot', 'alien'], mood: 'sci-fi' },
  { keywords: ['adventure', 'action', 'epic', 'hero', 'fantasy', 'quest'], mood: 'adventure' },
  { keywords: ['romance', 'love', 'romantic', 'relationship', 'couple'], mood: 'romantic' },
  { keywords: ['tonight', 'watch', 'something', 'recommend', 'suggest'], mood: 'popular' },
];

function detectMood(text) {
  const lower = text.toLowerCase();
  for (const { keywords, mood } of MOOD_DETECT) {
    if (keywords.some(k => lower.includes(k))) return mood;
  }
  return 'popular';
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/50"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export default function Assistant() {
  const { addMoodEntry } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Welcome to Cinewood's Film Assistant. I'm here to help you find the perfect film for any mood, moment, or emotion. What kind of cinematic experience are you looking for tonight?",
      movies: [],
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text, mood = null) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const detectedMood = mood || detectMood(text);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    try {
      const data = await aiRecommend(text);
      const movies = data.movies || [];
      const moodLabel = data.mood || 'curated';
      const aiResponse = data.message || AI_RESPONSES.popular;

      const aiMsg = {
        role: 'ai',
        content: aiResponse,
        movies,
        mood: moodLabel,
      };
      setMessages(prev => [...prev, aiMsg]);
      addMoodEntry(detectedMood, movies);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I'm having trouble connecting to the cinema database right now. Please ensure your TMDB API key is configured and try again.",
        movies: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt.text, prompt.mood);
  };

  return (
    <div className="min-h-screen bg-noir pt-24 pb-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-6 flex flex-col flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 glass rounded-2xl border border-slate mb-4">
            <RiChat3Line className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-cream mb-2">Film Assistant</h1>
          <p className="text-cream/35 text-sm">Find your next favorite film</p>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {QUICK_PROMPTS.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickPrompt(prompt)}
              disabled={loading}
              className="flex items-center gap-1.5 glass px-3.5 py-2 rounded-full border border-slate text-xs text-cream/50 hover:text-cream hover:border-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{prompt.icon}</span>
              <span>{prompt.text}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6 max-h-[60vh] pr-2">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="shrink-0 w-8 h-8 glass rounded-xl flex items-center justify-center border border-slate mt-1">
                    <RiSparklingLine className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div className={`max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user px-5 py-3.5' : 'chat-bubble-ai px-5 py-3.5'}>
                    <p className="text-cream/80 text-sm leading-relaxed">{msg.content}</p>
                  </div>

                  {/* Mood label */}
                  {msg.mood && (
                    <span className="text-xs text-primary/50 font-medium px-1">
                      ✦ {msg.mood} picks
                    </span>
                  )}

                  {/* Movie Results */}
                  {msg.movies?.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
                      {msg.movies.map((movie, mi) => (
                        <MovieCard key={movie.id} movie={movie} index={mi} />
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="shrink-0 w-8 h-8 bg-primary/15 rounded-xl flex items-center justify-center border border-primary/20 mt-1">
                    <RiFilmLine className="w-4 h-4 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-8 h-8 glass rounded-xl flex items-center justify-center border border-slate">
                  <RiSparklingLine className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="chat-bubble-ai">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass rounded-xl border border-slate p-2 flex items-end gap-3"
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Tell me your mood, what you're feeling, or what kind of film you want…"
            rows={2}
            disabled={loading}
            className="flex-1 bg-transparent text-cream placeholder-cream/20 text-sm resize-none focus:outline-none px-3 py-2 leading-relaxed disabled:opacity-50"
          />
          <GlowButton
            variant="solid"
            size="sm"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            icon={loading ? RiLoader4Line : RiSendPlaneLine}
            className={loading ? 'animate-spin' : ''}
          >
            {loading ? '' : 'Send'}
          </GlowButton>
        </motion.div>

        <p className="text-center text-cream/15 text-xs mt-3">
          Powered by TMDB · Cinewood Film Assistant
        </p>
      </div>
    </div>
  );
}
