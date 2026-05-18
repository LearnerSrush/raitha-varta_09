import React from 'react';
import { Home, Leaf, Scan, Bell, User, Cloud, Menu, WifiOff, RefreshCw, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { LanguageSelector } from './LanguageSelector';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOnline?: boolean;
  showSyncStatus?: boolean;
}

export const Layout: React.FC<Props> = ({ children, activeTab, setActiveTab, isOnline = true, showSyncStatus = false }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'crops', icon: Leaf, label: t('crops') },
    { id: 'scan', icon: Scan, label: t('scan') },
    { id: 'alerts', icon: Bell, label: t('alerts') },
    { id: 'profile', icon: User, label: t('profile') }
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 overflow-hidden max-w-md mx-auto shadow-2xl relative border-x border-gray-200 dark:border-zinc-800">
      {/* Offline/Sync Banners */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest z-50 sticky top-0"
          >
            <WifiOff className="w-3.5 h-3.5" />
            Working Offline
          </motion.div>
        )}
        {showSyncStatus && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-green-600 text-white py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest z-50 sticky top-0"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Data Synced
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white dark:bg-zinc-950 sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
            RAITHA<span className="text-green-600 font-medium whitespace-nowrap">-VARTA</span>
          </h1>
        </div>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[calc(448px-32px)] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-[32px] px-2 py-2 flex justify-between items-center shadow-2xl z-40 transition-all duration-300">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive ? "bg-green-600 text-white px-5" : "text-gray-400 hover:text-green-600"
              )}
            >
              <Icon className={cn("w-6 h-6 transition-transform duration-300", isActive && "scale-110")} />
              {isActive && (
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1 animate-in fade-in slide-in-from-bottom-1">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
