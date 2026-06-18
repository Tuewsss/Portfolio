import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import type { Dictionary, Language } from "./types";

export type { Dictionary, Language };

export const DEFAULT_LANGUAGE: Language = "pt";

export const dictionaries: Record<Language, Dictionary> = { pt, en, es };

export const LANGUAGES: { code: Language; label: string; country: string }[] = [
  { code: "pt", label: "Português", country: "br" },
  { code: "en", label: "English", country: "us" },
  { code: "es", label: "Español", country: "es" },
];

export function isLanguage(value: string | null): value is Language {
  return value === "pt" || value === "en" || value === "es";
}
