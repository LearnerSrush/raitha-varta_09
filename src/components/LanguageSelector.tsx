import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  return (
    <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-bold transition-all",
            i18n.language === lang.code 
              ? "bg-green-600 text-white shadow-lg scale-105" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
