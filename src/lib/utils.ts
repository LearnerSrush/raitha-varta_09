import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalized(field: any, lang: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field['en'] || Object.values(field)[0] || '';
}
