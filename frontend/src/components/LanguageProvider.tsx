"use client";

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, dictionaries, isLanguage, type Dictionary, type Language } from "@/lib/i18n";

const LANGUAGE_KEY = "portfolio:language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // O idioma salvo só existe no cliente (localStorage); ler aqui evita
  // mismatch de hidratação entre servidor e cliente (mesmo padrão do
  // VisitorProvider/WelcomeSplash). useLayoutEffect roda antes do paint,
  // então a troca de idioma fica praticamente imperceptível.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (isLanguage(stored)) setLanguageState(stored);
    } catch {
      // localStorage indisponível (ex: modo privado)
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // ignore
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
