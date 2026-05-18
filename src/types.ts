export type Language = 'kn' | 'en' | 'hi';

export enum CropType {
  PADDY = 'Paddy',
  TOMATO = 'Tomato',
  COCONUT = 'Coconut',
  ARECA_NUT = 'Areca Nut',
  MAIZE = 'Maize',
  SUGARCANE = 'Sugarcane',
  CHILLI = 'Chilli',
  ONION = 'Onion'
}

export enum DiseaseRisk {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Crop {
  id: string;
  type: CropType;
  health: number;
  healthTrend: 'improving' | 'declining' | 'stable';
  risk: DiseaseRisk;
  lastActivity: Record<Language, string> | string;
  growthStage: Record<Language, string> | string;
  stageProgress: number; // 0 to 100
  diseasePrediction: Record<Language, string> | string;
  diseaseCauses: Record<Language, string> | string;
  preventativeMeasures: (Record<Language, string> | string)[];
  recommendedActions: (Record<Language, string> | string)[];
  healthyImage?: string;
  scannedImage?: string;
  galleryImages?: string[];
  environmentalRisk?: {
    humidity: number;
    temperature: number;
    message: Record<Language, string> | string;
  };
  symptoms?: (Record<Language, string> | string)[];
  treatmentSteps?: {
    step: Record<Language, string> | string;
    dosage?: Record<Language, string> | string;
  }[];
  expectedRecovery?: Record<Language, string> | string;
}

export interface FlashTip {
  id: string;
  image: string;
  gallery?: string[];
  title: Record<Language, string>;
  description: Record<Language, string>;
  actionLine: Record<Language, string>;
  dosageInfo: Record<Language, string>;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'pest' | 'wind' | 'temp';
  severity: 'low' | 'medium' | 'high';
  message: Record<Language, string>;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  location: string;
  farmSize: string;
  soilType: string;
  irrigation: string;
  season: string;
  cropTypes: string[];
  language: Language;
  measurementUnit: 'Metric' | 'Imperial' | 'Traditional';
  farmingGoals: string[];
}
