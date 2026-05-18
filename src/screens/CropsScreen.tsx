import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Activity, AlertTriangle, ChevronRight, Plus, TrendingUp, TrendingDown, Minus, Sparkles, X, Check, Search, Mic, MicOff, RefreshCw } from 'lucide-react';
import { CropIcon } from '../components/CropIcon';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Crop, CropType, DiseaseRisk } from '../types';
import { getLocalized } from '../lib/utils';

interface Props {
  crops: Crop[];
  onSelectCrop: (crop: Crop) => void;
  onAddCrop: (crop: Crop) => void;
  onRefresh?: () => Promise<void>;
  isGuest?: boolean;
  isOnline?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'improving') return <TrendingUp className="w-3 h-3 text-green-500" />;
  if (trend === 'declining') return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-gray-400" />;
};

export const CropsScreen: React.FC<Props> = ({ crops, onSelectCrop, onAddCrop, onRefresh, isGuest, isOnline }) => {
  const { t, i18n } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropType, setNewCropType] = useState<CropType>(CropType.PADDY);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningError, setListeningError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pullThreshold = 100;
  const y = useMotionValue(0);
  const pullProgress = useTransform(y, [0, pullThreshold], [0, 1]);
  const pullRotation = useTransform(y, [0, pullThreshold], [0, 180]);

  const handleDragEnd = async () => {
    if (y.get() >= pullThreshold && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice Search not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set language based on app state
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'kn': 'kn-IN'
    };
    recognition.lang = langMap[i18n.language] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setListeningError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        setIsListening(false);
        setListeningError(null);
      } else if (event.error === 'network') {
        console.error('Speech recognition network error');
        setListeningError('Network error. Try opening in a new tab.');
        setIsListening(false);
      } else {
        console.error('Speech recognition error:', event.error);
        setListeningError(event.error);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      setIsListening(false);
    }
  };

  const filteredCrops = crops.filter(crop => 
    crop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLocalized(crop.growthStage, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (crop.diseasePrediction && getLocalized(crop.diseasePrediction, i18n.language).toLowerCase().includes(searchQuery.toLowerCase())) ||
    (crop.lastActivity && getLocalized(crop.lastActivity, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = () => {
    const newCrop: Crop = {
      id: Math.random().toString(36).substr(2, 9),
      type: newCropType,
      health: 100,
      healthTrend: 'stable',
      risk: DiseaseRisk.LOW,
      lastActivity: 'Planted today',
      growthStage: 'Seedling Stage',
      stageProgress: 5,
      diseasePrediction: 'Expected healthy development.',
      diseaseCauses: 'Optimized starting environment.',
      preventativeMeasures: ['Monitor soil moisture', 'Regular inspection'],
      recommendedActions: ['Ensure proper initial watering', 'Check for early pests'],
      healthyImage: 'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop',
      galleryImages: ['https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop'],
      symptoms: [],
      treatmentSteps: [],
      expectedRecovery: 'N/A'
    };
    onAddCrop(newCrop);
    setShowAddModal(false);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 flex justify-center py-4 pointer-events-none">
        <motion.div 
          style={{ 
            y: useTransform(y, [0, pullThreshold], [-40, 20]),
            opacity: pullProgress,
            rotate: pullRotation
          }}
          className="bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 p-3 rounded-full text-green-600"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.div>
      </div>

      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: pullThreshold }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="p-4 space-y-6"
      >
        <div className="flex justify-between items-center px-1">
          <h2 className="text-3xl font-black tracking-tighter dark:text-white">{t('crops')}</h2>
          {isRefreshing && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-600"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Syncing</span>
            </motion.div>
          )}
        </div>

      {/* Persistence Info Banner */}
      <AnimatePresence>
        {(isGuest || !isOnline) && crops.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-3xl border border-indigo-100 dark:border-indigo-800/30 flex items-center gap-3"
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">Local Storage Active</p>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100 leading-tight">Your crops are saved on this device. Sign in to sync across all your devices.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar with Voice */}
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search crops or growth stage..."
          className="w-full bg-white dark:bg-zinc-900 border-2 border-transparent focus:border-green-100 dark:focus:border-green-900/30 py-4 pl-14 pr-16 rounded-3xl shadow-sm font-bold text-gray-700 dark:text-gray-200 transition-all outline-none"
        />
        <button 
          onClick={startVoiceSearch}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl flex items-center justify-center transition-all ${
            isListening ? 'bg-red-500 text-white animate-pulse' : listeningError ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
          title={listeningError ? `Error: ${listeningError}` : "Voice Search"}
        >
          {isListening ? <Mic className="w-5 h-5" /> : listeningError ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {isListening && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border border-red-100"
        >
          Listening... Talk now
        </motion.div>
      )}

      {listeningError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border border-amber-100"
        >
          Voice error: {listeningError === 'not-allowed' ? 'Mic Permission Denied' : listeningError}. Try again.
        </motion.div>
      )}

      <button 
        onClick={() => setShowAddModal(true)}
        className="w-full bg-green-600 text-white p-6 rounded-[32px] flex items-center justify-between shadow-2xl shadow-green-200 group active:scale-95 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black opacity-70 uppercase tracking-widest">New Plantation</p>
            <p className="font-black text-xl">Register New Crop</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      <div className="grid gap-6">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectCrop(crop)}
              className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-zinc-800 flex flex-col gap-4 group active:scale-98 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Existing card content ... */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    crop.health > 90 ? 'bg-green-100/50 dark:bg-green-500/10 text-green-600' : crop.health > 70 ? 'bg-amber-100/50 dark:bg-amber-500/10 text-amber-600' : 'bg-red-100/50 dark:bg-red-500/10 text-red-600'
                  }`}>
                    <CropIcon type={crop.type} className="w-8 h-8" />
                  </div>
                  {(crop.scannedImage || crop.healthyImage) && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg border-2 border-white dark:border-zinc-900 overflow-hidden shadow-md">
                      <img 
                        src={crop.scannedImage || crop.healthyImage} 
                        className="w-full h-full object-cover" 
                        alt={crop.type}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight">{t(crop.type.toLowerCase())}</h3>
                    <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-full border border-gray-100 dark:border-zinc-700">
                      <TrendIcon trend={crop.healthTrend} />
                      <span className={`text-[10px] font-black uppercase ${
                        crop.healthTrend === 'improving' ? 'text-green-600' : crop.healthTrend === 'declining' ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {t(crop.healthTrend)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-bold text-gray-500">{crop.health}% {t('health_score')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className={crop.risk === 'High' ? 'text-red-500 w-3 h-3' : 'text-gray-400 w-3 h-3'} />
                      <span className={`text-xs font-bold ${crop.risk === 'High' ? 'text-red-600' : 'text-gray-500'}`}>
                        {crop.risk} Risk
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    crop.health > 90 ? 'bg-green-500' : crop.health > 70 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${crop.health}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{getLocalized(crop.growthStage, i18n.language)}</p>
                <div className="flex items-center text-green-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  {t('view_insights')} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 px-6 bg-white dark:bg-zinc-900 rounded-[40px] border border-dashed border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-black text-xl text-gray-900 dark:text-gray-100">No crops found</h3>
            <p className="text-sm font-bold text-gray-400">We couldn't find any data for "{searchQuery}". Try searching for categories like "Rice", "Wheat" or "Corn".</p>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {['Wheat', 'Paddy', 'Corn', 'Peppers'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-black text-xl tracking-tight dark:text-white">Farm Insights</h3>
          </div>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full uppercase">Real-time</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-3xl space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Crops</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{crops.length}</p>
            <p className="text-[10px] font-bold text-green-600">↑ {crops.length - 7} this session</p>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-3xl space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Avg.</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {Math.round(crops.reduce((acc, curr) => acc + curr.health, 0) / crops.length)}%
            </p>
            <p className="text-[10px] font-bold text-amber-600">Normal Range</p>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-3xl space-y-2 col-span-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Factor</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">Moderate</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-amber-100 dark:border-amber-900/30 border-t-amber-500 flex items-center justify-center">
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">Alert</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-indigo-900 rounded-3xl text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-300">Predictive Yield Forecast</p>
            <p className="text-lg font-black tracking-tight">{Math.round(crops.length * 6.5)} Quintals Est.</p>
          </div>
          <Sparkles className="w-8 h-8 text-indigo-400 opacity-50" />
        </div>
      </section>

    </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl relative z-10 p-8 space-y-8 border border-transparent dark:border-zinc-800"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black tracking-tight dark:text-white">New Crop</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Crop Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(CropType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewCropType(type)}
                      className={`p-4 rounded-2xl border-2 transition-all font-black text-sm flex items-center gap-2 ${
                        newCropType === type 
                          ? "bg-green-50 dark:bg-green-500/10 border-green-600 text-green-700 dark:text-green-400" 
                          : "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-400"
                      }`}
                    >
                      <CropIcon type={type} className={`w-5 h-5 ${newCropType === type ? 'text-green-600' : 'text-gray-400'}`} />
                      {t(type.toLowerCase())}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 active:scale-95 transition-all text-lg"
              >
                Register Plantation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
