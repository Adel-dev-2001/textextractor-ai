import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LANGUAGES, Language } from '../constants/languages';
import { en } from '../constants/i18n/en';
import { ar } from '../constants/i18n/ar';
import { ru } from '../constants/i18n/ru';

// --- Translation Data ---
const translations: Record<string, any> = {
  en,
  ar,
  ru
};


// --- Types ---
type Theme = 'light' | 'dark';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: string;
  setLanguage: (language: string) => void;
}

interface TranslationContextType {
    t: (key: string) => string;
    langInfo: Language;
}

// --- Contexts ---
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// --- Provider ---
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme;
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [language, setLanguageState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('language');
        if (storedLang && LANGUAGES[storedLang]) return storedLang;
        const browserLang = navigator.language.split('-')[0];
        return LANGUAGES[browserLang] ? browserLang : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
      document.documentElement.lang = language;
      document.documentElement.dir = LANGUAGES[language]?.dir || 'ltr';
      localStorage.setItem('language', language);
  }, [language]);
  
  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setLanguage = (newLang: string) => setLanguageState(newLang);

  const t = useMemo(() => (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language] || translations['en'];
    for (const k of keys) {
      if (result === undefined) break;
      result = result[k];
    }
    return typeof result === 'string' ? result : key;
  }, [language]);

  const langInfo = useMemo(() => LANGUAGES[language] || LANGUAGES['en'], [language]);

  const settingsValue: SettingsContextType = {
      theme,
      setTheme,
      language,
      setLanguage,
  };
  
  const translationValue: TranslationContextType = {
      t,
      langInfo
  };
  
  return (
    <SettingsContext.Provider value={settingsValue}>
      <TranslationContext.Provider value={translationValue}>
          {children}
      </TranslationContext.Provider>
    </SettingsContext.Provider>
  );
};


// --- Hooks ---
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
      throw new Error('useTranslation must be used within a SettingsProvider');
    }
    return context;
};
