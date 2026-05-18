import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { FlashTip, Language } from '../types';

interface Props {
  tip: FlashTip;
}

export const FlashCard: React.FC<Props> = ({ tip }) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as Language;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800 h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tip.image} 
          alt={tip.title[lang]} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {t('daily_tip')}
          </span>
        </div>
      </div>

      {tip.gallery && tip.gallery.length > 0 && (
        <div className="flex gap-2 p-4 bg-gray-50 dark:bg-zinc-800/50 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-zinc-800">
          {tip.gallery.map((img, i) => (
            <motion.img
              key={i}
              whileHover={{ scale: 1.1 }}
              src={img}
              className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-sm"
              alt={`Gallery ${i}`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2">
            {tip.title[lang]}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            {tip.description[lang]}
          </p>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/20">
            <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest block mb-1">
              {t('action')}
            </span>
            <p className="font-bold text-green-900 dark:text-green-100">{tip.actionLine[lang]}</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-1">
              {t('dose')}
            </span>
            <p className="font-bold text-amber-900 dark:text-amber-100">{tip.dosageInfo[lang]}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
