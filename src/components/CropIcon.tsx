import React from 'react';
import { 
  Wheat, 
  Sprout, 
  Leaf, 
  Flame, 
  CircleDot, 
  TreePalm, 
  Trees, 
  Circle,
  LucideIcon
} from 'lucide-react';
import { CropType } from '../types';

const ICON_MAP: Record<string, LucideIcon> = {
  [CropType.PADDY]: Wheat,
  [CropType.TOMATO]: Circle,
  [CropType.COCONUT]: TreePalm,
  [CropType.ARECA_NUT]: Trees,
  [CropType.MAIZE]: Wheat,
  [CropType.SUGARCANE]: Sprout,
  [CropType.CHILLI]: Flame,
  [CropType.ONION]: CircleDot,
};

interface Props {
  type: CropType | string;
  className?: string;
}

export const CropIcon: React.FC<Props> = ({ type, className = "w-6 h-6" }) => {
  const Icon = ICON_MAP[type] || Leaf;
  return <Icon className={className} />;
};
