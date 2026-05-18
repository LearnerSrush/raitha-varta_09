import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Camera, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Plus, 
  FileText, MapPin, UserPlus, Share2, Bell 
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

import { Crop, CropType, DiseaseRisk } from '../types';

interface Props {
  onAddCrop: (crop: Crop) => void;
  isOnline?: boolean;
}

export const ScanScreen: React.FC<Props> = ({ onAddCrop, isOnline = true }) => {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PHASES = [
    t('phase_1'),
    t('phase_2'),
    t('phase_3'),
    t('phase_4'),
    t('phase_5')
  ];

  const handleRegister = () => {
    if (!result) return;
    
    // Map crop name to CropType enum
    const typeMap: Record<string, CropType> = {
      'Paddy': CropType.PADDY,
      'Tomato': CropType.TOMATO,
      'Coconut': CropType.COCONUT,
      'Areca Nut': CropType.ARECA_NUT,
      'Maize': CropType.MAIZE,
      'Sugarcane': CropType.SUGARCANE,
      'Chilli': CropType.CHILLI,
      'Onion': CropType.ONION
    };

    const newCrop: Crop = {
      id: Math.random().toString(36).substr(2, 9),
      type: typeMap[result.cropName] || CropType.PADDY,
      health: result.severity === 'High' ? 45 : result.severity === 'Medium' ? 70 : 92,
      healthTrend: result.severity === 'High' ? 'declining' : 'stable',
      risk: result.severity === 'High' ? DiseaseRisk.HIGH : result.severity === 'Medium' ? DiseaseRisk.MEDIUM : DiseaseRisk.LOW,
      lastActivity: 'Scanned for diseases',
      growthStage: 'Unknown',
      stageProgress: 50,
      diseasePrediction: result.diseaseName,
      diseaseCauses: result.diseaseCauses || 'Detected during visual scan.',
      preventativeMeasures: [result.organicSolution],
      recommendedActions: [result.chemicalSolution],
      scannedImage: image || undefined,
      galleryImages: image ? [image] : [],
      healthyImage: 'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop',
      symptoms: result.symptoms || [],
      treatmentSteps: result.treatmentSteps || [],
      expectedRecovery: result.expectedRecovery || 'N/A'
    };
    
    onAddCrop(newCrop);
    setIsAdded(true);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      setIsLive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access denied", err);
      setIsLive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permission denied. Please enable camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Failed to access camera. Please try picking from gallery.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      // Stop the stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      
      setImage(dataUrl);
      setIsLive(false);
      setResult(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setIsLive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setLoading(true);
    setProgress(0);
    setResult(null);
    setIsAdded(false);
    
    // Simulate phases for better UX with progress tracking
    for (let i = 0; i < PHASES.length; i++) {
        setScanPhase(PHASES[i]);
        // Increment progress over the duration of the phase
        const phaseProgress = Math.floor(((i + 1) / (PHASES.length + 1)) * 100);
        
        // Internal steps for smooth progress bar
        const startProgress = progress;
        const diff = phaseProgress - startProgress;
        for(let step = 0; step <= 10; step++) {
            setProgress(startProgress + (diff * (step / 10)));
            await new Promise(r => setTimeout(r, 40));
        }
    }

    try {
      setScanPhase(t('detecting'));
      setProgress(90);
      const currentLang = i18n.language === 'kn' ? 'Kannada' : i18n.language === 'hi' ? 'Hindi' : 'English';
      const analysis = await geminiService.detectDisease(image, currentLang);
      setProgress(100);
      await new Promise(r => setTimeout(r, 400)); // Show 100% for a moment
      
      if (!analysis || typeof analysis !== 'object') {
        throw new Error("Invalid analysis response");
      }
      
      // Ensure essential fields exist
      if (!analysis.diseaseName) analysis.diseaseName = "Unidentified Condition";
      if (!analysis.cropName) analysis.cropName = "Unknown Crop";
      if (!analysis.severity) analysis.severity = "Medium";
      
      setResult(analysis);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert(error.message?.includes('Empty response') ? "The AI couldn't see the crop clearly. Please try a different angle." : "Failed to analyze image. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setScanPhase('');
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    
    const isSpecialCrop = result.cropName.toLowerCase().includes('tomato') || result.cropName.toLowerCase().includes('onion');
    const phNote = isSpecialCrop ? "\nIMPORTANT: Check soil pH levels immediately. Tomatoes prefer 6.0-6.8, Onions prefer 6.0-7.0. Health issues are often linked to improper pH." : "";

    const reportContent = `
RAITHA-VARTA CROP HEALTH REPORT
Generated: ${new Date().toLocaleString()}
----------------------------------
CROP: ${result.cropName}
DIAGNOSIS: ${result.diseaseName}
SEVERITY: ${result.severity}
CONFIDENCE: ${Math.round(result.confidence * 100)}%
${phNote ? phNote + '\n' : ''}
SYMPTOMS:
${(result.symptoms || []).map((s: string) => `- ${s}`).join('\n')}

ORGANIC SOLUTION:
${result.organicSolution}

CHEMICAL SOLUTION:
${result.chemicalSolution}

TREATMENT STEPS:
${(result.treatmentSteps || []).map((s: any, i: number) => `${i + 1}. ${s.step} (Dosage: ${s.dosage})`).join('\n')}

EXPECTED RECOVERY: ${result.expectedRecovery || 'N/A'}
----------------------------------
Disclaimer: This is an AI-generated diagnosis. Please consult a local agricultural expert for confirmed treatments.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CropReport_${result.cropName}_${result.diseaseName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ACTION_BUTTONS = [
    { label: 'Download Report', icon: <FileText className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-600', action: handleDownloadReport },
    { label: 'Locate Stores', icon: <MapPin className="w-4 h-4" />, color: 'bg-green-50 text-green-600', action: () => alert('Store locator coming soon!') },
    { label: 'Consult Expert', icon: <UserPlus className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600', action: () => alert('Connecting to expert...') },
    { label: 'Share Findings', icon: <Share2 className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600', action: () => alert('Sharing options opening...') },
    { label: 'Set Reminder', icon: <Bell className="w-4 h-4" />, color: 'bg-rose-50 text-rose-600', action: () => alert('Reminder set for follow-up scan.') }
  ];

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-3xl font-black tracking-tight dark:text-white">{t('scan_crop')}</h2>
          {!navigator.onLine && (
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800/30 uppercase tracking-widest flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Offline
            </span>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium px-8">{t('scan_desc')}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-[40px] shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
             {/* Tech Grid Background Animation */}
             <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute inset-0" 
                     style={{ 
                       backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', 
                       backgroundSize: '24px 24px' 
                     }} 
                />
             </div>
             
             <div className="w-24 h-24 mb-10 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-green-100 dark:text-zinc-800"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="276"
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (276 * progress) / 100 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-green-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.span 
                      key={progress}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-lg font-black text-green-700 dark:text-green-400"
                   >
                     {Math.round(progress)}%
                   </motion.span>
                </div>
             </div>

             <div className="max-w-[240px] w-full space-y-4 px-6 text-center">
                <AnimatePresence mode="wait">
                   <motion.div 
                      key={scanPhase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-1"
                   >
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">
                         {scanPhase}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                         System Processing
                      </p>
                   </motion.div>
                </AnimatePresence>

                <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                   <motion.div 
                      className="h-full bg-green-600"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                   />
                </div>
             </div>
             
             {/* Enhanced Scanning Line Effect */}
             <motion.div 
                animate={{ top: ['-5%', '105%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-green-400/20 to-transparent z-10 pointer-events-none"
             >
                <div className="h-0.5 w-full bg-green-400 shadow-[0_0_25px_rgba(74,222,128,0.6)]" />
             </motion.div>
          </div>
        )}
        <AnimatePresence mode="wait">
          {isLive ? (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center"
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full aspect-square object-cover rounded-[32px] shadow-inner bg-black"
              />
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsLive(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-full font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={capturePhoto}
                  className="bg-green-600 text-white w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera className="w-8 h-8" />
                </button>
              </div>
            </motion.div>
          ) : !image ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full max-w-xs"
            >
              {cameraError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100 mb-2 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{cameraError}</span>
                  </div>
                  <button 
                    onClick={() => setCameraError(null)}
                    className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-500 underline"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}

              <div 
                onClick={startCamera}
                className="w-24 h-24 bg-green-50 dark:bg-green-500/10 rounded-[32px] flex items-center justify-center text-green-600 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <Camera className="w-10 h-10" />
              </div>
              <button 
                onClick={startCamera}
                className="bg-green-600 text-white w-full py-4 rounded-full font-black shadow-lg shadow-green-200 active:scale-95 transition-all"
              >
                {cameraError ? 'Try Camera Again' : 'Open Camera'}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold text-sm hover:text-green-600 transition-colors"
              >
                <ImageIcon className="w-4 h-4" /> Pick from Gallery
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              <div className="relative w-full aspect-square max-w-sm rounded-[32px] overflow-hidden shadow-xl">
                <img src={image} className="w-full h-full object-cover" alt="To scan" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
                >
                  Change
                </button>
              </div>
              
              <button 
                disabled={loading}
                onClick={analyzeImage}
                className="mt-8 bg-green-600 text-white w-full max-w-sm py-4 rounded-full font-black text-lg shadow-xl shadow-green-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> {t('detecting')}
                  </>
                ) : (
                  t('detect')
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Analysis Result</h3>
                {result.isOfflineResult && (
                  <span className="text-[8px] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-black px-1.5 py-0.5 rounded-sm uppercase border border-amber-100 dark:border-amber-800/30">Local Lib</span>
                )}
              </div>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white">{result.diseaseName}</h4>
            </div>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${result.severity === 'High' ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'bg-green-50 dark:bg-green-500/10 text-green-600'}`}>
              {result.severity === 'High' ? <AlertCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Crop</p>
              <p className="font-black text-gray-900 dark:text-white">{result.cropName}</p>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Confidence</p>
              <p className="font-black text-gray-900 dark:text-white">{Math.round(result.confidence * 100)}%</p>
            </div>
          </div>

          {(result.cropName?.toLowerCase().includes('tomato') || result.cropName?.toLowerCase().includes('onion')) && (
            <div className="bg-blue-50 dark:bg-blue-600/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase mb-1">Critical Soil Health</p>
                <p className="text-blue-900 dark:text-blue-100 text-sm font-bold leading-tight">
                  Check soil pH immediately. {result.cropName} is sensitive to pH imbalance (Ideal: 6.0-7.0).
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-500/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/20">
              <p className="text-xs font-black text-green-700 dark:text-green-400 uppercase mb-2 italic">Organic Solution</p>
              <p className="text-green-900 dark:text-green-100 font-bold leading-relaxed">{result.organicSolution}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20">
              <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase mb-2 italic">Chemical Solution</p>
              <p className="text-amber-900 dark:text-amber-100 font-bold leading-relaxed">{result.chemicalSolution}</p>
            </div>
          </div>

          {/* New Scrollable Action Bar */}
          <div className="space-y-3">
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Quick Actions</p>
             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {ACTION_BUTTONS.map((btn, i) => (
                    <button 
                        key={i}
                        onClick={btn.action}
                        className={`${btn.color} whitespace-nowrap px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs transition-transform active:scale-95 flex-shrink-0 group shadow-sm`}
                    >
                        <span className="group-hover:scale-125 transition-transform">{btn.icon}</span>
                        {btn.label}
                    </button>
                ))}
             </div>
          </div>

          {!isAdded ? (
            <button 
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6" /> Register This Plantation
            </button>
          ) : (
            <div className="w-full bg-green-50 text-green-700 py-5 rounded-[24px] font-black text-center flex items-center justify-center gap-3 border border-green-200">
              <CheckCircle2 className="w-6 h-6" /> Successfully Registered!
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
