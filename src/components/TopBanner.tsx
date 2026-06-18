import React from 'react';
import { Calendar, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const TopBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-brand-purple text-amber-50 text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-1.5 opacity-90">
          <Calendar className="w-3.5 h-3.5 text-brand-ochre" />
          <span className="font-medium tracking-wide">
            {t.headerTopText || "La Rutalopó"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};
