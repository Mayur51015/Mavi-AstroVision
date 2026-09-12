import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  User,
  RefreshCw,
  MessageCircle,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAiServiceStatus, sendAiMessage } from '../utils/astrologyApi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

export default function AiAstrologyPage() {
  const { user } = useAuth();
  const [aiStatus, setAiStatus] = useState({ loading: true, configured: false, provider: null });
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Greetings ${user?.name ? user.name.split(' ')[0] : 'seeker of the stars'}! 🌙\n\nI am Mavi, your Cosmic Companion. When configured with an AI model, I synthesize your natal placements, planetary archetypes, and celestial transits to offer reflective insights.\n\nAsk me about your planetary placements, elemental balances, or life reflections.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  const suggestedQuestions = [
    'What does my Moon sign reveal about my emotional needs?',
    'How do my Sun and Ascendant blend to form my persona?',
    'What lessons does my Saturn placement suggest for personal growth?',
    'Which elements are dominant in my natal chart?',
    'How can I align my daily routine with my chart ruler?',
  ];

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setAiStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await getAiServiceStatus();
      if (res && res.success) {
        setAiStatus({ loading: false, configured: Boolean(res.configured), provider: res.provider });
      } else {
        setAiStatus({ loading: false, configured: false, provider: null });
      }
    } catch {
      setAiStatus({ loading: false, configured: false, provider: null });
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || loading || !aiStatus.configured) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await sendAiMessage(messageText, historyPayload);
      if (res.success && res.configured && res.reply) {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: res.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else if (!res.configured) {
        setAiStatus({ loading: false, configured: false, provider: null });
      }
    } catch {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'The celestial frequencies encountered a momentary distortion. Please try asking your question again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return text.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={`${line.trim() === '' ? 'h-2' : ''} leading-relaxed`}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="text-gold-300 font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto flex flex-col min-h-[82vh]">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Conversational Astrology Oracle"
        subtitle={
          user?.sunSign
            ? `Personalized reflections tuned to your ${user.sunSign} Sun${user.moonSign ? ` • ${user.moonSign} Moon` : ''}${user.ascendant ? ` • ${user.ascendant} Rising` : ''}`
            : 'Personalized reflections grounded in ancient archetypes and your natal coordinates'
        }
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            <Sparkles size={11} className="mr-1 inline" /> AI Cosmic Companion
          </Badge>
        }
        actions={
          aiStatus.configured && (
            <Badge variant="success" className="text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse" />
              {aiStatus.provider ? `Model: ${aiStatus.provider}` : 'Connected'}
            </Badge>
          )
        }
      />

      {/* Status: Loading */}
      {aiStatus.loading && (
        <div className="card-saas p-8 text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 text-gold-400 animate-spin" />
          <p className="text-xs text-slate-400">Connecting to celestial reasoning engine...</p>
        </div>
      )}

      {/* Status: Unconfigured Guardrail Banner */}
      {!aiStatus.loading && !aiStatus.configured && (
        <div className="space-y-6">
          <div className="card-saas p-6 sm:p-7 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="warning" className="text-[10px] uppercase font-bold">
                    Configuration Required
                  </Badge>
                  <button
                    onClick={checkStatus}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
                  >
                    <RefreshCw size={12} /> Check Connection
                  </button>
                </div>
                <h3 className="text-lg font-cinzel font-bold text-white">
                  Unlock Live Chart Conversations
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Notice: AI service key required. Configure{' '}
                  <code className="px-1.5 py-0.5 rounded bg-obsidian-950 text-gold-400 font-mono text-[11px] border border-obsidian-800">
                    GEMINI_API_KEY
                  </code>{' '}
                  or{' '}
                  <code className="px-1.5 py-0.5 rounded bg-obsidian-950 text-gold-400 font-mono text-[11px] border border-obsidian-800">
                    OPENAI_API_KEY
                  </code>{' '}
                  in your backend <code className="px-1.5 py-0.5 rounded bg-obsidian-950 text-gold-400 font-mono text-[11px] border border-obsidian-800">server/.env</code> to unlock real-time personalized discussions.
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  Mavi-AstroVision never simulates fake or hallucinated AI responses.
                </p>
              </div>
            </div>
          </div>

          {/* Questions available once configured */}
          <div className="card-saas p-6 space-y-4">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <MessageCircle size={14} /> Sample Questions Handled by Engine
            </div>
            <p className="text-xs text-slate-400">
              Once connected, the companion injects your exact Sun, Moon, Rising, and planetary placements from ephemeris calculations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available live features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-saas p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck size={15} className="text-emerald-400" /> How Personalization Works
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your birth chart coordinates calculated through our engine are framed within a structured system prompt, preventing fatalism while offering psychological archetypes.
              </p>
            </div>

            <div className="card-saas p-5 space-y-2">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <Compass size={15} /> Core Features Available Now
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You don&apos;t need an AI key for our core astrology engine! Explore your personalized Cosmic Life Map™, planetary scorecards, and daily celestial guidance right now:
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link to="/cosmic-life-map">
                  <Button variant="primary" size="sm" className="text-xs">
                    Cosmic Life Map™ <ChevronRight size={13} />
                  </Button>
                </Link>
                <Link to="/birth-chart" className="text-xs text-gold-400 hover:text-white underline">
                  Birth Chart
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Window (When Configured) */}
      {!aiStatus.loading && aiStatus.configured && (
        <div className="flex-1 flex flex-col space-y-4">
          {/* Suggestion Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-800 border border-obsidian-800 text-xs text-slate-300 hover:text-gold-300 whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="card-saas p-4 sm:p-6 flex-1 min-h-[460px] max-h-[600px] overflow-y-auto space-y-4 flex flex-col">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 mt-1">
                    <Sparkles size={15} />
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl max-w-xl text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-gold-500 text-obsidian-950 font-medium ml-12'
                      : 'bg-obsidian-950 border border-obsidian-800 text-slate-200 mr-12 space-y-1'
                  }`}
                >
                  {formatText(msg.text)}
                  <span
                    className={`text-[9px] block text-right mt-1.5 ${
                      msg.sender === 'user' ? 'text-obsidian-950/60' : 'text-slate-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-obsidian-800 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User size={15} />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <RefreshCw size={14} className="animate-spin" />
                </div>
                <div className="p-3.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs text-gold-400 flex items-center gap-2">
                  <Sparkles size={13} className="animate-pulse" /> Consulting celestial ephemeris...
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Ask about your planetary placements, transits, or archetypes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-obsidian-950 border border-obsidian-700 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-gold-500/60 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 rounded-lg bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-obsidian-950 transition font-bold"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
