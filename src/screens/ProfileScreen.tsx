import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Settings, Shield, Globe, MapPin, ChevronRight, LogOut, Edit2, Save, X, Leaf, Activity, Volume2, Sparkles, Loader2, Calendar, Target, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../hooks/useTheme';

import { User as FirebaseUser } from 'firebase/auth';
import { auth, db, signInWithGoogle, signOut, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

interface Props {
  user: FirebaseUser | null;
  onAdminToggle: () => void;
  isVoiceMode: boolean;
  onVoiceModeToggle: (enabled: boolean) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ user, onAdminToggle, isVoiceMode, onVoiceModeToggle, onLogout }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [farmingPlan, setFarmingPlan] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    uid: user?.uid || '',
    name: user?.displayName || 'Farmer',
    email: user?.email || '',
    location: 'Sagara, Shimoga',
    farmSize: '4.5 Acres',
    soilType: 'Red Loamy',
    irrigation: 'Drip System',
    season: 'Kharif',
    cropTypes: ['Areca Nut', 'Paddy'],
    language: i18n.language as any,
    measurementUnit: 'Metric',
    farmingGoals: ['Increase Yield', 'Reduce Cost']
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });

  useEffect(() => {
    if (user) {
      const isMockUser = user.uid.startsWith('user-') || user.uid.startsWith('demo-');
      
      if (isMockUser) {
        // Load profile from localStorage for mock users
        const savedProfile = localStorage.getItem(`profile_${user.uid}`);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
          setTempProfile(parsed);
        }
        return;
      }

      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            const mergedProfile = {
              ...profile, // Keep defaults
              ...data,
              // Ensure arrays exist for join operations
              cropTypes: data.cropTypes || [],
              farmingGoals: data.farmingGoals || []
            };
            setProfile(mergedProfile);
            setTempProfile(mergedProfile);
          } else {
            // Initialize if not exists
            const initialProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'Farmer',
              email: user.email || '',
              location: 'Sagara, Shimoga',
              farmSize: '4.5 Acres',
              soilType: 'Red Loamy',
              irrigation: 'Drip System',
              season: 'Kharif',
              cropTypes: ['Areca Nut', 'Paddy'],
              language: i18n.language as any,
              measurementUnit: 'Metric',
              farmingGoals: ['Increase Yield', 'Reduce Cost']
            };
            await setDoc(docRef, initialProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const isMockUser = user.uid.startsWith('user-') || user.uid.startsWith('demo-');

      try {
        if (isMockUser) {
          localStorage.setItem(`profile_${user.uid}`, JSON.stringify(tempProfile));
        } else {
          await setDoc(doc(db, 'users', user.uid), tempProfile);
        }
        
        setProfile({ ...tempProfile });
        i18n.changeLanguage(tempProfile.language);
        setIsEditing(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const generatePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

      const prompt = `As an expert agricultural advisory system for India, generate a personalized farming plan for a farmer with the following profile:
      Land Size: ${profile.farmSize}
      Soil Type: ${profile.soilType}
      Irrigation: ${profile.irrigation}
      Current Season: ${profile.season}
      Planned Crops: ${(profile.cropTypes || []).join(', ')}
      Location: ${profile.location}
      Measurement Unit: ${profile.measurementUnit}
      Farming Goals: ${(profile.farmingGoals || []).join(', ')}
      
      Provide the plan in ${profile.language === 'kn' ? 'Kannada' : profile.language === 'hi' ? 'Hindi' : 'English'}.
      Include:
      1. Sowing schedule
      2. Fertilization tips
      3. Irrigation management
      4. Pest prevention actions
      Keep it actionable and brief with bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      setFarmingPlan(response.text || "No plan generated.");
    } catch (error) {
      console.error('Error generating plan:', error);
      setFarmingPlan("Sorry, I couldn't generate a plan at this moment. Please try again later.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const menuItems = [
    { icon: User, label: 'Personal Information', value: profile.name, key: 'name' },
    { icon: MapPin, label: 'Location', value: profile.location, key: 'location' },
    { icon: Globe, label: t('language'), value: t(profile.language === 'kn' ? 'kannada' : profile.language === 'hi' ? 'hindi' : 'english'), key: 'language' },
    { icon: Settings, label: 'Notification Settings', value: 'Enabled' }
  ];

  const farmProfile = {
    size: '4.5 Acres',
    soilType: 'Red Loamy',
    irrigation: 'Drip System',
    region: profile.location
  };

  return (
    <div className="p-4 space-y-8 pb-32">
      {/* Header with Edit Button */}
      <div className="flex flex-col items-center space-y-4 pt-10 relative">
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 p-3 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl text-green-600 border border-gray-100 dark:border-zinc-800 active:scale-90 transition-all"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        ) : (
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="p-3 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl text-gray-400 border border-gray-100 dark:border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSave}
              className="p-3 bg-green-600 shadow-lg rounded-2xl text-white border border-green-700 active:scale-95 transition-all"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="w-32 h-32 bg-green-100 dark:bg-green-600/10 rounded-[48px] p-1 shadow-2xl relative">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
            className="w-full h-full rounded-[44px] bg-green-50 dark:bg-zinc-800" 
            alt="Profile"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="text-center w-full px-4">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">{profile.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-bold">Farmer ID #{profile.uid.slice(-5) || '99281'}</p>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-4 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Farmer Name</label>
                    <input 
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full text-lg font-black bg-white dark:bg-zinc-900 border-none rounded-2xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-green-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">District / Region</label>
                    <input 
                      type="text"
                      value={tempProfile.location}
                      onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                      placeholder="Location"
                      className="w-full font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-900 border-none rounded-2xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 pt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('language')}</p>
                  <div className="flex gap-2">
                    {[
                      { code: 'kn', label: t('kannada') },
                      { code: 'en', label: t('english') },
                      { code: 'hi', label: t('hindi') }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setTempProfile({ ...tempProfile, language: lang.code as any })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          tempProfile.language === lang.code 
                            ? "bg-green-600 text-white border-green-700 shadow-lg" 
                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-800"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* My Farm Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-green-600" />
            <h3 className="font-black text-xl tracking-tight dark:text-white">My Farm Profile</h3>
          </div>
          {isEditing && (
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/10">Editing</span>
          )}
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-600/10 p-6 rounded-[32px] border border-green-100 dark:border-green-900/30 flex flex-col gap-2">
              <p className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Land Size</p>
              <p className="text-2xl font-black text-green-900 dark:text-green-50">{profile.farmSize || 'N/A'}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-600/10 p-6 rounded-[32px] border border-amber-100 dark:border-amber-900/30 flex flex-col gap-2">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Soil Type</p>
              <p className="text-xl font-black text-amber-900 dark:text-amber-50">{profile.soilType || 'N/A'}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-600/10 p-6 rounded-[32px] border border-blue-100 dark:border-blue-900/30 flex flex-col gap-2">
              <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Season</p>
              <p className="text-xl font-black text-blue-900 dark:text-blue-50">{profile.season || 'N/A'}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-600/10 p-6 rounded-[32px] border border-purple-100 dark:border-purple-900/30 flex flex-col gap-2">
              <p className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest">Active Crops</p>
              <p className="text-lg font-black text-purple-900 dark:text-purple-50 line-clamp-1">{(profile.cropTypes || []).join(', ') || 'None'}</p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-600/10 p-6 rounded-[32px] border border-rose-100 dark:border-rose-900/30 flex flex-col gap-2">
              <p className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest">Unit System</p>
              <p className="text-xl font-black text-rose-900 dark:text-rose-50">{profile.measurementUnit || 'Metric'}</p>
            </div>
            <div className="col-span-2 bg-indigo-50 dark:bg-indigo-600/10 p-6 rounded-[32px] border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Irrigation Method</p>
                <p className="text-xl font-black text-indigo-900 dark:text-indigo-50">{profile.irrigation || 'N/A'}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm text-indigo-600 dark:text-indigo-400">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-[40px] border border-gray-100 dark:border-zinc-800">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Land Size</label>
                 <input 
                   type="text"
                   value={tempProfile.farmSize}
                   onChange={(e) => setTempProfile({ ...tempProfile, farmSize: e.target.value })}
                   className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Soil Type</label>
                 <input 
                   type="text"
                   value={tempProfile.soilType}
                   onChange={(e) => setTempProfile({ ...tempProfile, soilType: e.target.value })}
                   className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm"
                 />
               </div>
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Primary Crops (Comma separated)</label>
               <input 
                 type="text"
                 value={(tempProfile.cropTypes || []).join(', ')}
                 onChange={(e) => setTempProfile({ ...tempProfile, cropTypes: e.target.value.split(',').map(s => s.trim()) })}
                 className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm"
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Irrigation</label>
                 <select 
                   value={tempProfile.irrigation}
                   onChange={(e) => setTempProfile({ ...tempProfile, irrigation: e.target.value })}
                   className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm appearance-none"
                 >
                   <option>Drip System</option>
                   <option>Sprinkler</option>
                   <option>Rain-fed</option>
                   <option>Borewell / Open Well</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Measurement Unit</label>
                 <select 
                   value={tempProfile.measurementUnit}
                   onChange={(e) => setTempProfile({ ...tempProfile, measurementUnit: e.target.value as any })}
                   className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm appearance-none"
                 >
                   <option value="Metric">Metric (kg, m)</option>
                   <option value="Imperial">Imperial (lb, ft)</option>
                   <option value="Traditional">Traditional (Guntha, Bigha)</option>
                 </select>
               </div>
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Farming Goals (Comma separated)</label>
               <input 
                 type="text"
                 value={(tempProfile.farmingGoals || []).join(', ')}
                 onChange={(e) => setTempProfile({ ...tempProfile, farmingGoals: e.target.value.split(',').map(s => s.trim()) })}
                 className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm"
                 placeholder="e.g. Increase Yield, Reduce Cost"
               />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Season</label>
               <select 
                 value={tempProfile.season}
                 onChange={(e) => setTempProfile({ ...tempProfile, season: e.target.value })}
                 className="w-full font-bold bg-white dark:bg-zinc-900 dark:text-white border-none rounded-2xl py-3 px-4 shadow-sm appearance-none"
               >
                 <option>Kharif</option>
                 <option>Rabi</option>
                 <option>Zaid</option>
               </select>
             </div>
          </div>
        )}

        {/* AI Farming Plan Trigger */}
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePlan}
            disabled={isGeneratingPlan}
            className="w-full bg-gradient-to-r from-green-600 to-indigo-600 p-6 rounded-[32px] text-white flex items-center justify-between group shadow-xl shadow-green-100 disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                {isGeneratingPlan ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">AI Expert Advisor</p>
                <p className="font-black text-lg">Generate Farming Plan</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-40 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}

        {/* Farming Plan Display */}
        <AnimatePresence>
          {farmingPlan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[40px] border border-green-100 dark:border-green-900/20 shadow-xl overflow-hidden"
            >
              <div className="bg-green-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <h4 className="font-black text-xl">Your Personalized Plan</h4>
                </div>
                <button onClick={() => setFarmingPlan(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="prose prose-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {farmingPlan}
                </div>
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-600/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-400">
                  <Calendar className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Plan Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {[
          { icon: User, label: 'Personal Information', value: profile.name },
          { icon: MapPin, label: 'Location', value: profile.location },
          { icon: Globe, label: t('language'), value: t(profile.language === 'kn' ? 'kannada' : profile.language === 'hi' ? 'hindi' : 'english') }
        ].map((item, index) => (
          <div 
            key={index}
            className="w-full flex items-center gap-4 p-5 border-b border-gray-50 dark:border-zinc-800 last:border-b-0 group"
          >
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-400">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
              <p className="font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-zinc-700 opacity-20" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-50 text-blue-600'}`}>
              {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white leading-tight">Dark Appearance</p>
              <p className="text-xs font-bold text-gray-400">Reduce eye strain</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-green-600' : 'bg-gray-200'}`}
          >
            <motion.div 
              animate={{ x: theme === 'dark' ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        {/* Voice Mode Toggle */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white leading-tight">Voice Only Mode</p>
              <p className="text-xs font-bold text-gray-400">Navigate using voice</p>
            </div>
          </div>
          <button 
            onClick={() => onVoiceModeToggle(!isVoiceMode)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isVoiceMode ? 'bg-green-600' : 'bg-gray-200 dark:bg-zinc-800'}`}
          >
            <motion.div 
              animate={{ x: isVoiceMode ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <button 
          onClick={onAdminToggle}
          className="w-full bg-black dark:bg-zinc-800 text-white p-6 rounded-[32px] flex items-center justify-between group active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black opacity-50 uppercase tracking-widest">Enterprise</p>
              <p className="font-black text-lg">Admin Portal</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-40 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={() => {
            signOut();
            onLogout();
          }}
          className="w-full flex items-center justify-center gap-3 p-6 text-red-600 font-black text-lg hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[32px] transition-colors"
        >
          <LogOut className="w-6 h-6" /> Sign Out
        </button>
      </div>

      {/* Offline Storage Management */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[40px] space-y-6">
        <div className="flex items-center gap-3">
          <Save className="w-5 h-5 text-indigo-600" />
          <h3 className="font-black text-xl tracking-tight dark:text-white">Storage & Data</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offline Mode</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Auto-save to device</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          <button 
            onClick={() => {
              if (confirm("Are you sure you want to clear your local data? This will remove all crops saved on this device while logged out.")) {
                localStorage.removeItem('userCrops');
                window.location.reload();
              }
            }}
            className="w-full py-4 border-2 border-dashed border-red-100 dark:border-red-900/20 text-red-600 font-black text-sm rounded-[24px] hover:bg-red-50 dark:hover:bg-red-500/5 transition-all"
          >
            Clear Offline Cache
          </button>
        </div>
      </section>

      <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em] pb-10">
        v2.4.0 Production Build
      </p>
    </div>
  );
};
