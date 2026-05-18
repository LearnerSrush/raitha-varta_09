import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, Wand2, Plus, Users, LayoutGrid, CheckCircle2, 
  Loader2, ArrowLeft, Activity, Bell, Shield, TrendingUp,
  Search, Filter, MoreHorizontal, UserCheck, MessageSquare,
  AlertTriangle, Globe, Settings, Eye
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'content' | 'alerts';

export const AdminPortal: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [advisoryText, setAdvisoryText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [globalAlert, setGlobalAlert] = useState('');
  const [isPublishingAlert, setIsPublishingAlert] = useState(false);

  const handleProcess = async () => {
    if (!advisoryText) return;
    setIsProcessing(true);
    try {
      const card = await geminiService.processAdvisory(advisoryText);
      setGeneratedCard(card);
    } catch (error) {
      alert("AI Processing failed. Check console.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishAlert = async () => {
    if (!globalAlert) return;
    setIsPublishingAlert(true);
    // Simulate API call
    setTimeout(() => {
      setIsPublishingAlert(false);
      setGlobalAlert('');
      alert("Emergency alert broadcasted to 1,402 active users.");
    }, 1500);
  };

  const renderDashboard = () => (
    <div className="space-y-8 pb-32">
      {/* Platform Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Active Farmers', value: '1,402', color: 'blue', trend: '+12%' },
          { icon: Activity, label: 'Daily Scans', value: '428', color: 'green', trend: '+8%' },
          { icon: Bell, label: 'Active Alerts', value: '12', color: 'amber', trend: '-2' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
            <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black">Recent Activity</h3>
            <button className="text-xs font-black text-green-600 px-4 py-2 hover:bg-green-50 rounded-xl transition-colors">
              Export CSV
            </button>
          </div>
          <div className="space-y-4">
            {[
              { type: 'scan', user: 'Ramesh K.', crop: 'Paddy', status: 'Infected (Blast)', time: '2m ago' },
              { type: 'user', user: 'Suresh M.', crop: null, status: 'New Registration', time: '15m ago' },
              { type: 'scan', user: 'Mallesh A.', crop: 'Tomato', status: 'Healthy', time: '1h ago' },
              { type: 'alert', user: 'System', crop: 'Weather', status: 'Drought Warning Sent', time: '3h ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'scan' ? 'bg-blue-100 text-blue-600' : 
                    activity.type === 'user' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {activity.type === 'scan' ? <Eye className="w-5 h-5" /> : 
                     activity.type === 'user' ? <UserCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{activity.user}</p>
                    <p className="text-[10px] font-bold text-gray-500">{activity.status} {activity.crop && `• ${activity.crop}`}</p>
                  </div>
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase">{activity.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <div className="space-y-4">
          <button 
            onClick={() => setActiveTab('content')}
            className="w-full bg-green-600 text-white p-8 rounded-[40px] shadow-xl shadow-green-100 flex items-center justify-between group transition-all"
          >
            <div className="text-left">
              <p className="text-xs font-black opacity-50 uppercase tracking-widest mb-1">Editor</p>
              <h3 className="text-2xl font-black">Generate AI Tips</h3>
            </div>
            <Wand2 className="w-10 h-10 opacity-40 group-hover:rotate-12 transition-transform" />
          </button>

          <button 
            onClick={() => setActiveTab('alerts')}
            className="w-full bg-red-600 text-white p-8 rounded-[40px] shadow-xl shadow-red-100 flex items-center justify-between group transition-all"
          >
            <div className="text-left">
              <p className="text-xs font-black opacity-50 uppercase tracking-widest mb-1">Emergency</p>
              <h3 className="text-2xl font-black">Broadcast Alert</h3>
            </div>
            <Bell className="w-10 h-10 opacity-40 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContentManager = () => (
    <div className="space-y-8 pb-32">
      <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-600/10 rounded-2xl text-green-600 font-bold">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">Create AI Flashcard Tips</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-500 italic">Paste Advisory PDF content or text below</p>
          <textarea 
            value={advisoryText}
            onChange={(e) => setAdvisoryText(e.target.value)}
            placeholder="e.g. In Shimoga, excessive rains have caused root rot in Ginger crops. Recommend applying copper oxychloride..."
            className="w-full h-40 bg-gray-50 rounded-[32px] p-6 text-gray-900 font-bold border-none focus:ring-2 focus:ring-green-600 transition-all resize-none"
          />
          
          <button 
            disabled={isProcessing}
            onClick={handleProcess}
            className="w-full bg-green-600 text-white p-5 rounded-full font-black text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-[1px] transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
            ) : (
              <><Wand2 className="w-6 h-6" /> Generate Multi-Language Tips</>
            )}
          </button>
        </div>
      </section>

      {generatedCard && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[40px] shadow-xl border border-green-100 space-y-6"
        >
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="font-black text-lg">AI Generated Tip (Review)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Kannada (Default)</p>
              <p className="font-black text-gray-900 text-lg">{generatedCard.title.kn}</p>
              <p className="text-gray-600 mt-2">{generatedCard.description.kn}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-2xl opacity-50">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Translation Map</p>
              <p className="text-[10px] font-bold">English: {generatedCard.title.en}</p>
              <p className="text-[10px] font-bold">Hindi: {generatedCard.title.hi}</p>
            </div>
          </div>

          <button className="w-full border-2 border-green-600 text-green-600 p-4 rounded-full font-black">
            Publish to All Users
          </button>
        </motion.section>
      )}
    </div>
  );

  const renderAlertsManager = () => (
    <div className="space-y-8 pb-32">
      <section className="bg-red-50 p-8 rounded-[40px] border border-red-100 space-y-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-8 h-8" />
          <h3 className="text-2xl font-black">Emergency Broadcast</h3>
        </div>
        <p className="text-red-900/60 text-sm font-bold">
          Send a push notification and high-visibility alert to every user registered on the platform. Use for weather extremes or disease outbreaks.
        </p>
        
        <div className="space-y-4">
          <textarea 
            value={globalAlert}
            onChange={(e) => setGlobalAlert(e.target.value)}
            placeholder="Write your emergency message here..."
            className="w-full h-32 bg-white rounded-3xl p-6 text-gray-900 font-bold border-2 border-red-100 focus:border-red-600 focus:ring-0 transition-all resize-none shadow-sm"
          />
          <button 
            onClick={handlePublishAlert}
            disabled={!globalAlert || isPublishingAlert}
            className="w-full bg-red-600 text-white p-5 rounded-full font-black text-lg shadow-xl shadow-red-200 flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPublishingAlert ? <Loader2 className="w-6 h-6 animate-spin" /> : <Globe className="w-6 h-6" />}
            {isPublishingAlert ? 'Broadcasting...' : 'Blast All Users'}
          </button>
        </div>
      </section>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black mb-6">Recent Alerts</h3>
        <div className="space-y-4">
          {[
            { msg: 'Heavy Rainfall Warning - Mandya District', date: '2024-05-12', reach: '4,200', type: 'Weather' },
            { msg: 'Leaf Rust Outbreak Detected in Coffee', date: '2024-04-28', reach: '1,800', type: 'Disease' }
          ].map((alert, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[32px] border border-transparent hover:border-gray-200 transition-all">
              <div>
                <p className="text-xs font-black text-red-500 uppercase mb-1 tracking-widest">{alert.type}</p>
                <p className="font-black text-gray-900">{alert.msg}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-2">{alert.date} • Reached {alert.reach} farmers</p>
              </div>
              <button className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                <MoreHorizontal className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[#fcfdfb] flex flex-col">
      <header className="p-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight leading-tight italic">RAITHA-VARTA <span className="text-green-600">CMD</span></h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online</p>
            </div>
          </div>
        </div>
        <button className="p-3 bg-gray-50 rounded-2xl text-gray-600">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Tabs Navigation */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100 sticky top-[80px] z-40">
        {(['dashboard', 'users', 'content', 'alerts'] as AdminTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all uppercase tracking-widest ${
              activeTab === tab 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'content' && renderContentManager()}
            {activeTab === 'alerts' && renderAlertsManager()}
            {activeTab === 'users' && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Users className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-xl font-black text-gray-900">User Management</h3>
                <p className="text-sm font-bold text-gray-500 mt-2 max-w-xs">Securely managing 1,402 encrypted farmer profiles and scan histories.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
