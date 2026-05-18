import React, { useState, useEffect } from 'react';
import './i18n';
import { Layout } from './components/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { CropsScreen } from './screens/CropsScreen';
import { ScanScreen } from './screens/ScanScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminPortal } from './screens/AdminPortal';
import { CropDetailScreen } from './screens/CropDetailScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WifiOff, Cloud, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthScreen } from './screens/AuthScreen';
import { VoiceControl } from './components/VoiceControl';
import { ChatAssistant } from './components/ChatAssistant';
import { AnimatePresence, motion } from 'motion/react';
import { Crop } from './types';
import { auth, db, signOut, signInWithGoogle, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';

import { INITIAL_CROPS } from './data';
import { ThemeProvider } from './hooks/useTheme';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirebaseReachable, setIsFirebaseReachable] = useState(true);
  const [showSyncStatus, setShowSyncStatus] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hasSeenOnboarding'));

  // Network Status listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncStatus(true);
      setTimeout(() => setShowSyncStatus(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth listener
  useEffect(() => {
    const savedGuest = localStorage.getItem('isGuest');
    if (savedGuest === 'true') setIsGuest(true);

    const savedMockUser = localStorage.getItem('mockUser');
    if (savedMockUser) setUser(JSON.parse(savedMockUser));

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        setIsGuest(false);
        localStorage.removeItem('isGuest');
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync crops from Firestore when logged in (only for real Firebase users)
  useEffect(() => {
    // If not logged in, in guest mode, or using a mock user, use local storage
    const isMockUser = user?.uid?.startsWith('user-') || user?.uid?.startsWith('demo-');
    
    if (isGuest || !user || isMockUser) {
      const savedCrops = localStorage.getItem('userCrops');
      if (savedCrops) setCrops(JSON.parse(savedCrops));
      else setCrops(INITIAL_CROPS);
      return;
    }

    const q = query(collection(db, 'users', user.uid, 'crops'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cropsData = snapshot.docs.map(doc => ({ ...doc.data() } as Crop));
      if (cropsData.length > 0) {
        setCrops(cropsData);
        setSyncError(null); // Clear error on success
      } else if (isOnline) {
        setCrops([]);
      }
    }, (error) => {
      let friendlyMessage = "Connection failed. Working offline.";
      try {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/crops`);
      } catch (err: any) {
        // Detailed error for developers, friendly for users
        console.warn("Firestore sync error handled for UI fallback.");
        const errorData = err.message.startsWith('{') ? JSON.parse(err.message) : { error: err.message };
        
        if (errorData.error.includes('permission-denied')) {
          friendlyMessage = "Sync permission denied. Please check your account.";
        } else if (!navigator.onLine) {
          friendlyMessage = "You are currently offline. Sync will resume automatically.";
        } else if (errorData.error.includes('quota')) {
          friendlyMessage = "Daily sync limit reached. Working offline.";
        } else {
          friendlyMessage = "Cloud sync interrupted. Using local data.";
        }
        setIsFirebaseReachable(false);
      }
      
      setSyncError(friendlyMessage);
      
      // Fallback to local storage if Firestore fails
      const savedCrops = localStorage.getItem('userCrops');
      if (savedCrops) setCrops(JSON.parse(savedCrops));

      // Clear error after some time if it's just a connection blip
      setTimeout(() => setSyncError(null), 6000);
    });

    return () => unsubscribe();
  }, [user, isGuest, isOnline]);

  // Persistence of tab state
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  // Local storage backup for EVERYTHING as failure fallback
  useEffect(() => {
    localStorage.setItem('userCrops', JSON.stringify(crops));
  }, [crops]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCrop(null); // Clear selected crop when switching tabs
    localStorage.setItem('activeTab', tab);
  };

  const handleRefreshCrops = async () => {
    if (!isOnline) {
      setSyncError("Cannot refresh while offline.");
      setTimeout(() => setSyncError(null), 3000);
      return;
    }
    
    setShowSyncStatus(true);
    // Simulate a brief delay to show the sync animation and verify cloud state
    await new Promise(resolve => setTimeout(resolve, 1200));
    setShowSyncStatus(false);
  };

  const addCrop = async (newCrop: Crop) => {
    // Always update local state first for immediate UI feedback (and offline support)
    setCrops(prev => {
      const updated = [...prev, newCrop];
      localStorage.setItem('userCrops', JSON.stringify(updated));
      return updated;
    });

    const isMockUser = user?.uid?.startsWith('user-') || user?.uid?.startsWith('demo-');

    if (user && !isMockUser) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'crops', newCrop.id), newCrop);
      } catch (error) {
        // If offline or error, we've already saved to local state and localStorage
        console.warn("Firestore sync failed, will retry when online:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="font-black text-green-800 tracking-tight">KisanAI Loading...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    if (selectedCrop && activeTab === 'crops') {
      return <CropDetailScreen crop={selectedCrop} onBack={() => setSelectedCrop(null)} />;
    }

    switch (activeTab) {
      case 'home': return <HomeScreen onVoiceToggle={() => setIsVoiceMode(!isVoiceMode)} onTabChange={handleTabChange} />;
      case 'crops': return (
        <CropsScreen 
          crops={crops} 
          onSelectCrop={(crop) => setSelectedCrop(crop)} 
          onAddCrop={addCrop}
          onRefresh={handleRefreshCrops}
          isGuest={isGuest}
          isOnline={isOnline}
        />
      );
      case 'scan': return <ScanScreen onAddCrop={addCrop} isOnline={isOnline} />;
      case 'alerts': return <AlertsScreen />;
      case 'profile': return (
        <ProfileScreen 
          user={user} 
          onAdminToggle={() => setIsAdminMode(true)} 
          isVoiceMode={isVoiceMode}
          onVoiceModeToggle={setIsVoiceMode}
          onLogout={() => {
            setIsGuest(false);
            localStorage.removeItem('isGuest');
            localStorage.removeItem('mockUser');
            window.location.reload(); // Force clear states
          }}
        />
      );
      default: return <HomeScreen />;
    }
  };

  if (isAdminMode) {
    return <AdminPortal onBack={() => setIsAdminMode(false)} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen 
        onComplete={() => {
          setShowOnboarding(false);
          localStorage.setItem('hasSeenOnboarding', 'true');
        }} 
      />
    );
  }

  if (!user && !isGuest) {
    return <AuthScreen 
      onGuestLogin={() => {
        setIsGuest(true);
        localStorage.setItem('isGuest', 'true');
      }} 
      onMockLogin={(mockUser: FirebaseUser) => {
        setUser(mockUser);
        setIsGuest(false);
      }}
      isFirebaseReachable={isFirebaseReachable}
    />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange} isOnline={isOnline} showSyncStatus={showSyncStatus}>
      <AnimatePresence>
        {syncError && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4" />
              <p className="text-[11px] font-bold tracking-tight">{syncError}</p>
            </div>
            <button onClick={() => setSyncError(null)} className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800/40 rounded-lg transition-colors">
              <X className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <VoiceControl onCommand={handleTabChange} activeTab={activeTab} isVoiceMode={isVoiceMode} />
      <ChatAssistant />
    </Layout>
  );
}
