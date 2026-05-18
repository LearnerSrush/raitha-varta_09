import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, MessageCircle, Mic, ArrowRight, Check, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: t('onboarding_welcome_title'),
      description: t('onboarding_welcome_desc'),
      icon: <Sparkles className="w-12 h-12 text-amber-600" />,
      color: 'bg-amber-50',
      accent: 'bg-amber-600'
    },
    {
      title: t('onboarding_scan_title'),
      description: t('onboarding_scan_desc'),
      icon: <Scan className="w-12 h-12 text-green-600" />,
      color: 'bg-green-50',
      accent: 'bg-green-600'
    },
    {
      title: t('onboarding_tips_title'),
      description: t('onboarding_tips_desc'),
      icon: <MessageCircle className="w-12 h-12 text-blue-600" />,
      color: 'bg-blue-50',
      accent: 'bg-blue-600'
    },
    {
      title: t('onboarding_voice_title'),
      description: t('onboarding_voice_desc'),
      icon: <Mic className="w-12 h-12 text-indigo-600" />,
      color: 'bg-indigo-50',
      accent: 'bg-indigo-600'
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className={`p-10 rounded-[48px] ${slides[step].color} mb-12 shadow-inner border border-white/50 backdrop-blur-sm relative group`}>
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.2, type: 'spring' }}
                 className="relative z-10"
               >
                 <motion.div
                   animate={{ 
                     y: [0, -10, 0],
                   }}
                   transition={{ 
                     duration: 3, 
                     repeat: Infinity, 
                     ease: "easeInOut" 
                   }}
                 >
                   {slides[step].icon}
                 </motion.div>
               </motion.div>
               <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full translate-y-4"></div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black tracking-tight text-gray-900 mb-4"
            >
              {slides[step].title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-500 font-medium leading-relaxed max-w-sm"
            >
              {slides[step].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12 space-y-8">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step 
                  ? `w-8 ${slides[step].accent}` 
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={onComplete}
            className="text-gray-400 font-black text-sm uppercase tracking-widest px-4 hover:text-gray-600 transition-colors"
          >
            {t('onboarding_skip')}
          </button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-black text-white shadow-xl transition-all ${slides[step].accent}`}
          >
            <span className="uppercase tracking-widest text-sm">
              {step === slides.length - 1 ? t('onboarding_start') : t('onboarding_next')}
            </span>
            {step === slides.length - 1 ? (
              <Check className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
