import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherWidget } from '../components/WeatherWidget';
import { FlashCard } from '../components/FlashCard';
import { SAMPLE_TIPS, INITIAL_ALERTS } from '../data';
import { Bell, ChevronRight, MessageCircle, Newspaper, ExternalLink, Mic, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

const AGRI_NEWS = [
  {
    id: 1,
    title: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಹನಿ ನೀರಾವರಿಗೆ ಹೊಸ ಸಬ್ಸಿಡಿ ಘೋಷಣೆ (New Subsidy for Drip Irrigation)',
    source: 'AgriNews Karnataka',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=400&auto=format&fit=crop',
    url: 'https://pib.gov.in'
  },
  {
    id: 2,
    title: 'ಅಡಿಕೆ ಬೆಳೆಗಾರರಿಗೆ ಸಿಹಿ ಸುದ್ದಿ: ಉತ್ತಮ ಇಳುವರಿ ಪಡೆಯಲು ತಜ್ಞರ ಸಲಹೆ',
    source: 'Horticulture Digest',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop',
    url: 'https://krishijagran.com'
  },
  {
    id: 3,
    title: 'ಮಲೆನಾಡು ಭಾಗದಲ್ಲಿ ಮುಂದಿನ ವಾರ ಭಾರಿ ಮಳೆ ಎಚ್ಚರಿಕೆ (Heavy Rain Alert for Malnad)',
    source: 'IMD Update',
    time: '8h ago',
    image: 'https://images.unsplash.com/photo-1516912481808-34091f85040d?q=80&w=400&auto=format&fit=crop',
    url: 'https://mausam.imd.gov.in'
  },
  {
    id: 4,
    title: 'ಬೆಂಬಲ ಬೆಲೆಗೆ ರಾಗಿ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆ ಆರಂಭ - ರೈತರಿಗೆ ಅನುಕೂಲ',
    source: 'Raitha Varta',
    time: '12h ago',
    image: 'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=400&auto=format&fit=crop',
    url: 'https://www.karnataka.gov.in'
  }
];

const NEWSPAPERS = [
  { id: 1, name: 'Krishi Pete', language: 'Kannada', icon: '🚜', url: 'https://epaper.prajavani.net' },
  { id: 2, name: 'Samyukta Karnataka', language: 'Kannada', icon: '📰', url: 'https://www.samyuktakarnataka.com' },
  { id: 3, name: 'Agri Gold', language: 'English', icon: '🌾', url: 'https://www.krishijagran.com' },
  { id: 4, name: 'Farmer Weekly', language: 'Hindi', icon: '🌍', url: 'https://www.icar.org.in' }
];

interface Props {
  onVoiceToggle?: () => void;
  onTabChange?: (tab: string) => void;
}

import { AnimatedButton } from '../components/AnimatedButton';

export const HomeScreen: React.FC<Props> = ({ onVoiceToggle }) => {
  const { t, i18n } = useTranslation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const lang = i18n.language as Language;

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % SAMPLE_TIPS.length);
  };

  return (
    <div className="p-4 space-y-6">
      <WeatherWidget />

      <motion.div 
        whileHover={{ scale: 1.01, rotate: -0.5 }}
        whileTap={{ scale: 0.96 }}
        onClick={onVoiceToggle}
        className="bg-indigo-600 p-6 rounded-[40px] text-white flex items-center justify-between overflow-hidden relative cursor-pointer group shadow-2xl shadow-indigo-200"
      >
        <div className="relative z-10 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('voice_feature')}</p>
          <h3 className="text-xl font-black tracking-tight leading-tight">{t('voice_title')}</h3>
          <p className="text-xs font-bold text-indigo-200 mt-2 italic">{t('voice_desc')}</p>
        </div>
        <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md relative z-10 shadow-xl border border-white/10 group-hover:scale-110 transition-transform group-hover:bg-white/30">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Mic className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
      </motion.div>

      {/* High Priority Alerts */}
      <AnimatePresence>
        {INITIAL_ALERTS.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ height: 0, opacity: 0, scale: 0.9 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            whileHover={{ x: 5 }}
            className={`p-4 rounded-2xl flex items-start gap-3 border shadow-sm cursor-pointer ${
              alert.severity === 'high' 
                ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-900/20 text-red-900 dark:text-red-200' 
                : 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/20 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{t('alerts')}</p>
              <p className="font-bold text-sm leading-snug">{alert.message[lang]}</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 self-center" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('daily_tip')}</h3>
          <button onClick={nextTip} className="text-green-600 font-bold text-sm hover:underline active:scale-95 transition-transform flex items-center gap-1">
            {t('next_tip')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[560px]">
          <FlashCard tip={SAMPLE_TIPS[currentTipIndex]} />
        </div>
      </div>

      {/* News Feed Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="p-2 bg-green-100 rounded-xl">
            <Newspaper className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-black text-xl tracking-tight dark:text-white">{t('news_title')}</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {AGRI_NEWS.map((news, i) => (
            <motion.div 
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              onClick={() => handleOpenUrl(news.url)}
              className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 flex gap-4 h-32 cursor-pointer active:scale-95 transition-all"
            >
              <img src={news.image} className="w-32 h-full object-cover" alt={news.title} />
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{news.source}</p>
                  <h4 className="font-black text-sm leading-tight text-gray-900 dark:text-gray-100 line-clamp-2">{news.title}</h4>
                </div>
                <p className="text-[10px] font-bold text-gray-400">{news.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* E-Newspapers Section */}
      <section className="space-y-4 bg-gray-950 -mx-4 p-8 rounded-[60px] mt-12 mb-20">
        <div className="flex items-center justify-between text-white mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ExternalLink className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-black text-xl tracking-tight">{t('epaper_title')}</h3>
          </div>
          <button className="text-green-400 text-xs font-extrabold uppercase tracking-widest bg-green-400/10 px-4 py-2 rounded-full hover:bg-green-400/20 transition-colors">
            {t('see_all')}
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {NEWSPAPERS.map((paper) => (
            <motion.div 
              key={paper.id}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenUrl(paper.url)}
              className="min-w-[140px] bg-white/5 backdrop-blur-xl rounded-[32px] p-5 flex flex-col items-center gap-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl flex items-center justify-center text-3xl shadow-lg">
                {paper.icon}
              </div>
              <div className="text-center">
                <p className="text-white font-black text-xs leading-tight mb-1">{paper.name}</p>
                <div className="bg-green-500/20 px-2 py-0.5 rounded-full inline-block">
                  <p className="text-green-400 text-[9px] font-black uppercase tracking-tighter">{paper.language}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 12 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -4, 0],
          boxShadow: [
            "0 10px 15px -3px rgb(22 163 74 / 0.3)",
            "0 20px 25px -5px rgb(22 163 74 / 0.5)",
            "0 10px 15px -3px rgb(22 163 74 / 0.3)"
          ]
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="fixed bottom-28 right-6 w-16 h-16 bg-green-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 transition-all border-4 border-white dark:border-zinc-900"
      >
        <MessageCircle className="w-8 h-8 font-bold" />
      </motion.button>
    </div>
  );
};
