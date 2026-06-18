"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, dictionaries, isLanguage, type Dictionary, type Language } from "@/lib/i18n";
import { useStoredState } from "@/lib/useStoredState";

const LANGUAGE_KEY = "portfolio:language";

function readLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function writeLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // localStorage indisponível (ex: modo privado)
  }
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useStoredState(DEFAULT_LANGUAGE, readLanguage, writeLanguage);

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
