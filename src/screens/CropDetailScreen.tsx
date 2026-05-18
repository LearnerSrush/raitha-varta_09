import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Activity, AlertTriangle, CheckCircle2, Info, Calendar, 
  Thermometer, Droplets, TrendingUp, TrendingDown, Minus, Sparkles, 
  ChevronRight, X, ExternalLink, Shield, TrendingUp as TrendUpIcon, 
  Stethoscope, Pill, Timer, Microscope, Maximize2, ChevronLeft
} from 'lucide-react';
import { CropIcon } from '../components/CropIcon';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { Crop } from '../types';
import { getLocalized } from '../lib/utils';

interface Props {
  crop: Crop;
  onBack: () => void;
}

// Image Gallery Component
const ImageGallery = ({ images, healthyImage }: { images: string[], healthyImage?: string }) => {
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const allImages = [...images, healthyImage].filter(Boolean) as string[];

  if (allImages.length === 0) return null;

  return (
    <div className="relative group">
      <div 
        className="w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl border border-white dark:border-zinc-800 cursor-zoom-in bg-gray-100 dark:bg-zinc-800"
        onClick={() => setIsZoomed(true)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={allImages[index]}
            src={allImages[index]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full object-cover"
            alt="Crop Detail"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop';
            }}
          />
        </AnimatePresence>
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              {index === allImages.length - 1 && healthyImage ? 'Reference' : `Capture #${index + 1}`}
            </span>
          </div>
        </div>

        <button 
          className="absolute top-4 right-4 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {allImages.length > 1 && (
        <>
          <button 
            onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-zinc-900/90 shadow-lg rounded-full text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-zinc-900/90 shadow-lg rounded-full text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col p-6"
          >
            <div className="flex items-center justify-between p-4">
              <h3 className="text-white font-black uppercase text-xs tracking-widest">Visual Inspection Mode</h3>
              <button onClick={() => setIsZoomed(false)} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
               <motion.img 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src={allImages[index]} 
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-2xl"
                  alt="Zoomed Crop"
                  referrerPolicy="no-referrer"
               />
               
               {allImages.length > 1 && (
                 <div className="absolute inset-x-0 bottom-10 flex justify-center gap-6">
                    <button onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))} className="p-4 bg-white/10 rounded-full text-white">
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button onClick={() => setIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))} className="p-4 bg-white/10 rounded-full text-white">
                      <ChevronRight className="w-8 h-8" />
                    </button>
                 </div>
               )}
            </div>

            <div className="p-8 text-center">
               <p className="text-white font-bold text-lg mb-2">Detailed Visual Analysis</p>
               <p className="text-gray-400 text-sm">Pinch to zoom or use gestures to inspect leaf surface micro-structures.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Generate mock historical data for the charts
const generateHealthData = (currentHealth: number) => {
  return [
    { day: 'Mon', health: currentHealth - 15 },
    { day: 'Tue', health: currentHealth - 8 },
    { day: 'Wed', health: currentHealth - 12 },
    { day: 'Thu', health: currentHealth - 5 },
    { day: 'Fri', health: currentHealth - 2 },
    { day: 'Sat', health: currentHealth - 4 },
    { day: 'Sun', health: currentHealth },
  ];
};

const STAGES = ['Sowing', 'Vegetative', 'Flowering', 'Maturation'];
const generateGrowthData = (progress: number) => {
  return STAGES.map((stage, i) => {
    const stageThreshold = (i + 1) * 25;
    const value = progress >= stageThreshold ? 100 : (progress > i * 25 ? (progress % 25) * 4 : 0);
    return { name: stage, value };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 font-black text-xs">
        <p className="text-gray-400 uppercase mb-1">{label}</p>
        <p className="text-indigo-600 font-black text-lg">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const TrendBadge = ({ trend }: { trend: string }) => {
  const { t } = useTranslation();
  const styles = {
    improving: 'bg-green-100 text-green-700 border-green-200',
    declining: 'bg-red-100 text-red-700 border-red-200',
    stable: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  const Icons = {
    improving: TrendingUp,
    declining: TrendingDown,
    stable: Minus
  };
  const Icon = Icons[trend as keyof typeof Icons];

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${styles[trend as keyof typeof styles]}`}>
      <Icon className="w-3 h-3" />
      {t(trend)}
    </div>
  );
};

export const CropDetailScreen: React.FC<Props> = ({ crop, onBack }) => {
  const { t, i18n } = useTranslation();
  const [showReference, setShowReference] = useState(false);

  return (
    <div className="h-full bg-gray-50 dark:bg-zinc-950 flex flex-col">
      <header className="p-6 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-xl">
              <CropIcon type={crop.type} className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight dark:text-white">{t(crop.type.toLowerCase())}</h2>
          </div>
        </div>
        <TrendBadge trend={crop.healthTrend} />
      </header>

      <div className="p-6 space-y-8 overflow-y-auto pb-32">
        {/* Visual Inspection Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-lg dark:text-white">Visual Evidence</h3>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{crop.scannedImage ? 'Recent Analysis' : 'Reference View'}</span>
          </div>
          <ImageGallery 
            images={crop.galleryImages && crop.galleryImages.length > 0 ? crop.galleryImages : (crop.scannedImage ? [crop.scannedImage] : [])} 
            healthyImage={crop.healthyImage} 
          />
        </section>

        {/* Status Card */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-50 dark:border-zinc-800 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className={`p-4 rounded-[28px] shadow-sm ${
              crop.health > 90 
                ? 'bg-green-50 dark:bg-green-500/10 text-green-600' 
                : crop.health > 70 
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' 
                  : 'bg-red-50 dark:bg-red-500/10 text-red-600'
            }`}>
              <Activity className="w-10 h-10" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('health_score')}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter dark:text-white">{crop.health}%</span>
                <span className={`text-xs font-bold ${
                  crop.healthTrend === 'improving' ? 'text-green-600' : crop.healthTrend === 'declining' ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {crop.healthTrend === 'improving' ? '↑' : crop.healthTrend === 'declining' ? '↓' : '→'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('disease_risk')}</p>
            <p className={`text-2xl font-black tracking-tight ${crop.risk === 'High' ? 'text-red-500' : 'text-green-600'}`}>
              {t(crop.risk.toLowerCase())}
            </p>
          </div>
          
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-zinc-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        </div>

        {/* Health History Chart */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg tracking-tight dark:text-white">Health History</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Live Trend</span>
            </div>
          </div>
          <div className="h-56 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateHealthData(crop.health)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '5 5' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-gray-50 dark:border-zinc-800/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-[10px] font-bold text-gray-400 capitalize">7 day performance: <span className="text-green-600">+15% improvement</span></p>
            </div>
            <p className="text-[9px] font-black italic text-indigo-600/50">Raitha-Varta Analytics</p>
          </div>
        </section>

        {/* Predictive Environmental Risk */}
        {crop.environmentalRisk && (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 p-6 rounded-[32px] border border-red-100 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-red-900 tracking-tight">AI Predictive Alert</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 p-3 rounded-2xl flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400">Humidity</p>
                  <p className="font-black text-gray-800">{crop.environmentalRisk.humidity}%</p>
                </div>
              </div>
              <div className="bg-white/60 p-3 rounded-2xl flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400">Temperature</p>
                  <p className="font-black text-gray-800">{crop.environmentalRisk.temperature}°C</p>
                </div>
              </div>
            </div>

            <p className="text-red-700 font-bold text-sm leading-relaxed border-l-4 border-red-500 pl-3">
              {getLocalized(crop.environmentalRisk.message, i18n.language)}
            </p>
          </motion.section>
        )}

        {/* Growth Stage Analysis */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg tracking-tight dark:text-white">Growth Insight</h3>
            </div>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
              {crop.stageProgress}% Completed
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateGrowthData(crop.stageProgress)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} 
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} animationDuration={1000}>
                    {generateGrowthData(crop.stageProgress).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value === 100 ? '#2563eb' : entry.value > 0 ? '#60a5fa' : '#f1f5f9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-50 dark:border-blue-900/10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <p className="text-xs font-bold text-blue-800 dark:text-blue-200">
               {t('current_stage')}: <span className="underline font-black">{getLocalized(crop.growthStage, i18n.language)}</span>. {t('harvest_prediction', { weeks: 4 })}
              </p>
            </div>
          </div>
        </section>

        {/* AI Severity Scan Card */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
               <Activity className="w-6 h-6" />
               <h3 className="font-black text-lg tracking-tight">{t('ai_severity_scan')}</h3>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Scan #4421
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 * (1 - (crop.risk === 'High' ? 0.85 : crop.risk === 'Medium' ? 0.45 : 0.12))} className={crop.risk === 'High' ? 'text-red-500' : 'text-indigo-500'} />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                   <span className="text-xl font-black dark:text-white">{crop.risk === 'High' ? '85' : crop.risk === 'Medium' ? '45' : '12'}%</span>
                   <span className="text-[6px] font-bold text-gray-400 uppercase">Infected</span>
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight">AI has detected abnormal patterns on the leaf surface.</p>
                <button 
                  onClick={() => setShowReference(true)}
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl group active:scale-95 transition-all"
                >
                   Compare with healthy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        </section>

        {/* AI Prediction & Detailed Analysis */}
        <section className="bg-indigo-900 p-6 rounded-[32px] shadow-xl text-white space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-xl">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg tracking-tight">{t('ai_diagnosis')}</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">{t('observation')}</p>
              <p className="font-bold text-lg leading-tight">{getLocalized(crop.diseasePrediction, i18n.language)}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{t('root_causes')}</p>
              <p className="font-bold text-sm text-indigo-100 leading-relaxed italic opacity-80">"{getLocalized(crop.diseaseCauses, i18n.language)}"</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 px-1">
                <Shield className="w-4 h-4 text-indigo-300" />
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{t('preventative_measures')}</p>
              </div>
              <div className="grid gap-3 font-sans">
                {crop.preventativeMeasures.map((measure, idx) => (
                  <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-start gap-4 transition-all hover:bg-white/20">
                    <div className="w-6 h-6 bg-indigo-500/30 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-100">
                       <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="font-bold text-sm text-indigo-50 leading-tight">{getLocalized(measure, i18n.language)}</p>
                  </div>
                ))}
              </div>
            </div>

            {crop.symptoms && crop.symptoms.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 px-1">
                  <Stethoscope className="w-4 h-4 text-indigo-300" />
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{t('identified_symptoms')}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {crop.symptoms.map((symptom, idx) => (
                    <div key={idx} className="bg-indigo-500/20 px-3 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                       <p className="text-[10px] font-bold text-indigo-100">{getLocalized(symptom, i18n.language)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {crop.treatmentSteps && crop.treatmentSteps.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 px-1">
                  <Pill className="w-4 h-4 text-indigo-300" />
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{t('treatment_protocol')}</p>
                </div>
                <div className="space-y-3">
                  {crop.treatmentSteps.map((step, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4">
                      <div className="w-8 h-8 bg-indigo-500/30 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-bold text-sm text-indigo-50 leading-tight">{getLocalized(step.step, i18n.language)}</p>
                        {step.dosage && (
                          <div className="inline-flex items-center gap-1.5 bg-indigo-500/40 px-2 py-0.5 rounded-lg border border-indigo-400/30">
                            <Microscope className="w-3 h-3 text-indigo-200" />
                            <span className="text-[9px] font-black uppercase text-indigo-100">{t('dose')}: {getLocalized(step.dosage, i18n.language)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {crop.expectedRecovery && (
              <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-green-400">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-green-400 uppercase tracking-widest">{t('recovery_est')}</p>
                  <p className="font-black text-lg text-green-100 tracking-tight">{getLocalized(crop.expectedRecovery, i18n.language)}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Abstract BG Decorations */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        </section>

        {/* Recommended Actions - Personalized */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-black text-lg dark:text-white">{t('recommended_actions')}</h3>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase">Top 3 Tasks</span>
          </div>
          <div className="grid gap-4">
            {crop.recommendedActions.map((action, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4 group hover:border-green-100 transition-all"
              >
                <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 font-black text-sm">
                  {i + 1}
                </div>
                <p className="font-black text-gray-700 dark:text-gray-300 flex-1">{getLocalized(action, i18n.language)}</p>
                <div className="w-6 h-6 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-300 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Smart History Note */}
        <section className="bg-amber-50 dark:bg-amber-600/10 p-6 rounded-[32px] border border-amber-100 dark:border-amber-900/20 flex gap-4">
           <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
             <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
           </div>
           <div>
             <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">AI Smart Tip</p>
             <p className="text-sm font-bold text-amber-900 dark:text-amber-100 leading-relaxed">
               You performed <span className="underline decoration-amber-300 dark:decoration-amber-900">"{getLocalized(crop.lastActivity, i18n.language)}"</span> recently. For {t(crop.type.toLowerCase())}, we suggest checking soil pH as the next step to maximize {getLocalized(crop.growthStage, i18n.language)} efficiency.
             </p>
           </div>
        </section>
      </div>

      {/* Reference Image Modal */}
      <AnimatePresence>
        {showReference && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReference(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-zinc-800"
            >
              <div className="relative h-64 bg-gray-100 dark:bg-zinc-800">
                <img 
                  src={crop.healthyImage || 'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop'} 
                  className="w-full h-full object-cover" 
                  alt="Healthy Reference"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setShowReference(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute top-4 left-4">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Healthy Reference
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-2xl text-gray-900 dark:text-white tracking-tight">Optimal {t(crop.type.toLowerCase())}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Target State: 100% Health Score</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-2xl text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-3xl border border-gray-100 dark:border-zinc-700">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-3">Key Indicators to verify</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Uniform green pigmentation without spots</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Turgid leaf structure (no wilting or curling)</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Healthy vein structure and root-to-leaf flow</p>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowReference(false)}
                  className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none"
                >
                  Got it, I understand!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
