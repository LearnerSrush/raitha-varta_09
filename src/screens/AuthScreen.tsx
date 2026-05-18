import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, ArrowRight, AlertCircle, 
  CheckCircle2, Loader2, Leaf, ShieldCheck, Sprout, Sparkles
} from 'lucide-react';
// Firebase is intentionally bypassed for this local-first version
// import { ... } from '../lib/firebase';

type AuthMode = 'login' | 'register' | 'forgot';

interface Props {
  onGuestLogin?: () => void;
  onMockLogin?: (user: any) => void;
  isFirebaseReachable?: boolean;
}

export const AuthScreen: React.FC<Props> = ({ onGuestLogin, onMockLogin, isFirebaseReachable = true }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Local-only mode: Redirect result check omitted
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Mock Login Logic (Bypassing Firebase)
    setTimeout(() => {
      if (mode === 'forgot') {
        setMessage("If this email is registered, you will receive reset instructions. (Mock)");
        setLoading(false);
        return;
      }

      if (onMockLogin) {
        const mockUser = {
          uid: `user-${email.split('@')[0] || '123'}`,
          email: email,
          displayName: email.split('@')[0].toUpperCase(),
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          emailVerified: true
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.removeItem('isGuest');
        onMockLogin(mockUser);
      }
      setLoading(false);
    }, 1000);
  };

  const handleMockLogin = () => {
    if (onMockLogin) {
      const mockUser = {
        uid: 'demo-user-123',
        email: 'demo@kisan.ai',
        displayName: 'Demo Farmer',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
        emailVerified: true
      };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.removeItem('isGuest');
      onMockLogin(mockUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 dark:bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50 dark:bg-amber-500/5 rounded-full blur-3xl -ml-40 -mb-40 opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-3xl shadow-xl shadow-green-200 dark:shadow-green-900/20 mb-6 group">
            <Sprout className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-[900] text-gray-900 dark:text-white tracking-tighter mb-2 italic uppercase">
            Kisan <span className="text-green-600 font-black">AI</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
            Local & Secure Smart Agricultural Assistant
          </p>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800/40 p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 dark:shadow-none transition-colors">
          <div className="flex bg-gray-100/50 dark:bg-zinc-800/50 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${mode === 'login' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {t('login')}
            </button>
            <button 
              onClick={() => { setMode('register'); setError(null); setMessage(null); }}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${mode === 'register' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {t('register')}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest pl-1">{t('email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-600 dark:text-white"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest pl-1">{t('password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-600 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border border-red-100 dark:border-red-900/20"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border border-green-100 dark:border-green-900/20"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'login' && (
              <button 
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs font-bold text-green-600 hover:text-green-700 w-full text-right px-1"
              >
                {t('forgot_password')}
              </button>
            )}

            <button 
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-green-600/20 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {mode === 'login' ? t('login') : mode === 'register' ? t('register') : t('reset_pass')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-gray-100 dark:bg-zinc-800 flex-1" />
            <span className="text-[10px] font-black text-gray-300 dark:text-zinc-600 uppercase tracking-widest">Local Mode Active</span>
            <div className="h-px bg-gray-100 dark:bg-zinc-800 flex-1" />
          </div>

          <button 
            onClick={handleMockLogin}
            className="w-full mt-4 bg-gray-50 dark:bg-zinc-800/50 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl py-3 font-black text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-gray-600 transition-all text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Try Fast Demo (Guest Login)
          </button>

          {onGuestLogin && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
              <button 
                onClick={onGuestLogin}
                className="w-full bg-indigo-50 dark:bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-600/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Try Demo / Offline Mode
              </button>
              <p className="text-[9px] text-center text-gray-400 font-bold mt-3 px-4">
                Use this to skip login and stay on this device.
              </p>
            </div>
          )}

          {mode === 'forgot' && (
            <button 
              onClick={() => setMode('login')}
              className="w-full text-center mt-6 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Back to Login
            </button>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 opacity-40 grayscale pointer-events-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black tracking-widest uppercase">Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            <span className="text-[10px] font-black tracking-widest uppercase">Organic</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
