import { GoogleGenAI } from "@google/genai";

let aiInstance: any = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI insights will be disabled.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  location: string;
  forecast: Array<{
    date: string;
    temp: number;
    condition: string;
  }>;
  aiInsight?: string;
}

export const weatherService = {
  // Mijar, Moodbidri Coordinates
  LAT: 13.0485,
  LON: 74.9691,
  LOCATION_NAME: 'Mijar, Moodbidri',
  CACHE_KEY: 'raitha_varta_weather_cache',

  async getWeatherData(): Promise<WeatherData> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${this.LAT}&longitude=${this.LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      const weatherCodes: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
      };

      const current = data.current;
      const daily = data.daily;

      const weatherData: WeatherData = {
        temperature: Math.round(current.temperature_2m),
        condition: weatherCodes[current.weather_code] || 'Unknown',
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        rainProbability: daily.precipitation_probability_max[0],
        location: this.LOCATION_NAME,
        forecast: daily.time.slice(1, 4).map((time: string, index: number) => ({
          date: time,
          temp: Math.round((daily.temperature_2m_max[index + 1] + daily.temperature_2m_min[index + 1]) / 2),
          condition: weatherCodes[daily.weather_code[index + 1]] || 'Unknown',
        })),
      };

      // Add AI Insight
      weatherData.aiInsight = await this.getAiInsight(weatherData);

      // Save to cache for offline use
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data: weatherData,
        timestamp: Date.now()
      }));

      return weatherData;
    } catch (error) {
      console.warn('Weather fetch failed, attempting to load from cache...', error);
      
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }

      // Final Fallback if no cache exists
      return {
        temperature: 30,
        condition: 'Partly Cloudy',
        humidity: 75,
        windSpeed: 10,
        rainProbability: 20,
        location: this.LOCATION_NAME,
        forecast: [],
        aiInsight: 'Ensure proper drainage as coastal regions prepare for pre-monsoon showers.'
      };
    }
  },

  async getAiInsight(weather: WeatherData): Promise<string> {
    try {
      const ai = getAi();
      if (!ai) return 'Monitor soil moisture levels closely.';

      const prompt = `As an expert agricultural AI, provide a specific 1-sentence farming advice for the next 3 days in ${weather.location} based on this weather: 
      Current: ${weather.condition}, ${weather.temperature}°C, Humidity ${weather.humidity}%. 
      Forecast: ${weather.forecast.map(f => `${f.date}: ${f.condition} (${f.temp}°C)`).join(', ')}.
      Focus on crop health, pest risk, or irrigation. Keep it concise (max 15 words).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      return response.text?.trim() || 'Monitor soil moisture levels closely.';
    } catch (error) {
      return 'Maintain regular irrigation cycles.';
    }
  }
};
