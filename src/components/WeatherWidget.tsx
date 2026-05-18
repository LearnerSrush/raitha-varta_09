import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Wind, Droplets, Sun, CloudRain, Zap, Loader2, Sparkles } from 'lucide-react';
import { weatherService, WeatherData } from '../services/weatherService';

export const WeatherWidget: React.FC = () => {
  const { t } = useTranslation();
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
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="w-6 h-6" />;
    if (lower.includes('thunderstorm')) return <Zap className="w-6 h-6" />;
    if (lower.includes('cloud')) return <Cloud className="w-6 h-6" />;
    if (lower.includes('clear') || lower.includes('sun')) return <Sun className="w-6 h-6" />;
    return <Cloud className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="bg-blue-600 text-white p-6 rounded-[32px] shadow-xl shadow-blue-200 h-[220px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin opacity-50" />
          <p className="text-blue-100 text-xs font-medium">{t('fetching_weather')}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-blue-600 text-white p-6 rounded-[32px] shadow-xl shadow-blue-200 relative overflow-hidden transition-all duration-500">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-blue-100 font-bold uppercase text-[10px] tracking-widest">{t('weather')}</p>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-5xl font-black">{weather.temperature}°C</h2>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              {getWeatherIcon(weather.condition)}
            </div>
          </div>
          <p className="font-bold flex items-center gap-1 mt-2 text-sm opacity-90">
            {weather.condition}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{weather.location}</p>
          <p className="text-blue-200 text-xs">Karnataka, IN</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6 relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
        <div className="flex flex-col items-center">
          <Droplets className="w-4 h-4 text-blue-200 mb-1" />
          <p className="text-[10px] opacity-70">{t('humidity')}</p>
          <p className="font-bold text-xs text-nowrap">{weather.humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <Wind className="w-4 h-4 text-blue-200 mb-1" />
          <p className="text-[10px] opacity-70">{t('wind')}</p>
          <p className="font-bold text-xs text-nowrap">{weather.windSpeed} km/h</p>
        </div>
        <div className="flex flex-col items-center">
          <CloudRain className="w-4 h-4 text-blue-200 mb-1" />
          <p className="text-[10px] opacity-70">{t('rain')}</p>
          <p className="font-bold text-xs text-nowrap">{weather.rainProbability}%</p>
        </div>
      </div>

      {weather.aiInsight && (
        <div className="mt-4 relative z-10 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 group hover:bg-white/20 transition-all cursor-default">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">{t('live_prediction')}</p>
          </div>
          <p className="text-[11px] leading-relaxed italic text-white/90">
            "{weather.aiInsight}"
          </p>
        </div>
      )}

      {/* Decorative Blur */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
