import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ChatBot = () => {
  const location = useLocation();
  // Hide on AI Astrology pages where the full chat interface already exists
  const hiddenPaths = ['/chatbot', '/ai-astrology'];
  const shouldHide = hiddenPaths.includes(location.pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 🌙 I\'m Mavi, your celestial assistant. Ask me anything about horoscopes, zodiac signs, or birth charts!',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickReplies = [
    'What are today\'s transits?',
    'Are Leo and Sagittarius compatible?',
    'Tell me about Moon signs',
    'Is Mercury retrograde?'
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input;
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: messageText });
      if (res.data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: res.data.reply,
            sender: 'bot',
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'The stars encountered a cosmic pause. Please try asking again!',
          sender: 'bot',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
  };

  return shouldHide ? null : (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-cosmic-900 border border-cosmic-700 rounded-lg shadow-2xl w-80 h-[500px] flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cosmic-800 to-cosmic-900 p-4 rounded-t-lg border-b border-cosmic-700 flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Cosmic Assistant</h3>
                <p className="text-cosmic-300 text-xs">Online now</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-cosmic-300 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-xs text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gold-500 text-cosmic-950'
                        : 'bg-cosmic-800 text-cosmic-50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-cosmic-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-cosmic-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-cosmic-500 rounded-full animate-pulse delay-200"></div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-cosmic-700 space-y-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="w-full text-left text-xs bg-cosmic-800 hover:bg-cosmic-700 text-cosmic-300 p-2 rounded transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-cosmic-700 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-cosmic-800 text-white placeholder-cosmic-500 border border-cosmic-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-cosmic-950 p-2 rounded transition"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-cosmic-500 to-gold-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
};

export default ChatBot;
