import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INITIAL_ALERTS } from '../data';
import { Bell, CloudLightning, Bug, Thermometer, Wind, Check, Sparkles, Loader2, CloudRain, Sun, Zap, Cloud } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { weatherService, WeatherData } from '../services/weatherService';

export const AlertsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Language;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const data = await weatherService.getWeatherData();
      setWeather(data);
      setLoading(false);
    };
    fetchWeather();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'rain': return <CloudLightning className="w-6 h-6" />;
      case 'pest': return <Bug className="w-6 h-6" />;
      case 'temp': return <Thermometer className="w-6 h-6" />;
      default: return <Wind className="w-6 h-6" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="w-5 h-5 text-blue-500" />;
    if (lower.includes('thunderstorm')) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (lower.includes('cloud')) return <Cloud className="w-5 h-5 text-gray-500" />;
    if (lower.includes('clear') || lower.includes('sun')) return <Sun className="w-5 h-5 text-orange-500" />;
    return <Cloud className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-3xl font-black tracking-tight dark:text-white">{t('alerts')}</h2>

      {/* AI Weather Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-[32px] text-white shadow-lg shadow-green-200 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('live_prediction')}</span>
          </div>
          
          {loading ? (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="w-6 h-6 animate-spin opacity-50" />
              <p className="font-bold opacity-70 text-sm tracking-tight">{t('fetching_weather')}</p>
            </div>
          ) : weather ? (
            <div className="space-y-4">
              <p className="text-xl font-black leading-tight tracking-tight">
                {weather.aiInsight}
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
                    <p className="text-[10px] opacity-70 font-bold mb-2">
                      {new Date(f.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </p>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(f.condition)}
                    </div>
                    <p className="font-black text-sm">{f.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-8 -mb-8"></div>
      </motion.div>

      <div className="space-y-4">
        {INITIAL_ALERTS.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-[32px] border-2 relative overflow-hidden ${
              alert.severity === 'high' ? 'bg-white dark:bg-zinc-900 border-red-100 dark:border-red-900/10' : 'bg-white dark:bg-zinc-900 border-amber-100 dark:border-amber-900/10'
            }`}
          >
            <div className="flex gap-4 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                alert.severity === 'high' ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'
              }`}>
                {getIcon(alert.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {alert.severity} Severity
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 capitalize">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  {alert.message[lang]}
                </p>
              </div>
            </div>
            
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 ${
              alert.severity === 'high' ? 'bg-red-600' : 'bg-amber-600'
            } rounded-full blur-2xl`}></div>
          </motion.div>
        ))}

        <div className="bg-gray-100 dark:bg-zinc-900 rounded-[32px] p-8 text-center space-y-2 grayscale opacity-50 border-2 border-dashed border-gray-200 dark:border-zinc-800">
          <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-bold truncate">No more unread alerts</p>
        </div>
      </div>
    </div>
  );
};
