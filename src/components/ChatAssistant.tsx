import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Bot, Sparkles, Loader2, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAssistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize greeting based on language
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = i18n.language === 'kn' 
        ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ರೈತ-ವಾರ್ತ ಸಹಾಯಕಿ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' 
        : i18n.language === 'hi'
        ? 'नमस्ते! मैं आपकी रायता-वार्ता सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?'
        : 'Hello! I am your Raitha-Varta AI assistant. How can I help you today?';
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [i18n.language, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('paddy') || q.includes('rice')) {
      return "Paddy info (Offline): Keep water levels consistent. Check for leaf blast if it's humid.";
    }
    if (q.includes('pests') || q.includes('insect')) {
      return "Pest Control (Offline): Neem oil is a good organic repellent. For severe infestations, consult a local agri-expert.";
    }
    if (q.includes('weather')) {
      return "Weather info is unavailable offline. Please check your local FM radio or newspaper.";
    }
    if (q.includes('market') || q.includes('price')) {
      return "Market prices require an internet connection to fetch the latest data.";
    }
    return "I am currently in Offline Mode. I can provide basic advice on Paddy, Pests, and General Farming. Connect to the internet for full AI Analysis.";
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    if (!isOnline) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: getOfflineResponse(userMsg) }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await geminiService.askAssistant(userMsg, i18n.language);
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'I am sorry, I am unable to process that at the moment.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please check your connection.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 z-[60]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-200 dark:shadow-none transition-all ${
            isOpen ? 'bg-gray-900 border-2 border-white/20 text-white' : 'bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-400/10'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          
          {!isOpen && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 ${isOnline ? 'bg-amber-500' : 'bg-gray-400'}`}
            >
              {isOnline ? <Sparkles className="w-3 h-3 text-white" /> : <WifiOff className="w-3 h-3 text-white" />}
            </motion.div>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100, x: 20 }}
            className="fixed bottom-44 right-6 left-6 md:left-auto md:w-[380px] h-[580px] max-h-[70vh] bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl z-[70] flex flex-col overflow-hidden border border-gray-100 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="bg-green-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-[900] text-lg tracking-tight italic">RAITHA-VARTA <span className="text-white/70">AI</span></h3>
                  <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    {isOnline ? (
                      <>
                        <Sparkles className="w-3 h-3" /> {t('chat_assistant')}
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3" /> Offline Assistant
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-zinc-900/50 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-bold leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-none shadow-lg shadow-green-100 dark:shadow-none' 
                      : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('ai_thinking')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={!isOnline ? 'Offline Assistance...' : t('type_here')}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl pl-5 pr-14 py-4 text-sm font-bold focus:ring-4 focus:ring-green-600/10 transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-10 h-10 bg-green-600 text-white rounded-xl disabled:opacity-50 transition-all flex items-center justify-center hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
