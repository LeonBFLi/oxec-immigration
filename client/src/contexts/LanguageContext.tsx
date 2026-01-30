import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { Language, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('zh');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load language from localStorage on mount (client-side only)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage === 'en' || savedLanguage === 'zh') {
        setLanguageState(savedLanguage);
      } else {
        // Default to Chinese if no saved preference
        setLanguageState('zh');
      }
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  // Don't render until hydration is complete
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
