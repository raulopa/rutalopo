import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { appTranslations } from '../translations';

interface LanguageSelectorProps {
  className?: string;
  buttonClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = "flex items-center gap-1 font-semibold",
  buttonClassName = "px-2 py-1 rounded transition-all text-[11px] uppercase",
  activeClassName = "bg-brand-ochre text-slate-950 shadow-sm",
  inactiveClassName = "hover:bg-white/10 text-white"
}) => {
  const { lang, setLang } = useLanguage();

  return (
    <div className={className}>
      {(['ca', 'es', 'en'] as const).map((currLang) => (
        <button
          key={currLang}
          onClick={() => setLang(currLang)}
          className={`${buttonClassName} ${lang === currLang ? activeClassName : inactiveClassName}`}
        >
          {appTranslations[currLang].languageName}
        </button>
      ))}
    </div>
  );
};
