"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme, type ThemeMode } from "@/components/providers/ThemeProvider";

const ICONS: Record<ThemeMode, React.ReactNode> = {
  white: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M3.3 12.7l1.1-1.1M11.6 4.4l1.1-1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  dark: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46C6.951 21.75 2.25 17.05 2.25 11.25c0-4.367 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
    </svg>
  ),
  weather: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.8 11.5a2.8 2.8 0 0 1-.3-5.58 3.4 3.4 0 0 1 6.5-1.2 2.6 2.6 0 0 1 3 2.55 2.5 2.5 0 0 1-.7 4.9H4.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function ThemeSwitcher() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const MODES: ThemeMode[] = ["white", "dark", "weather"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.theme.selectLabel}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:scale-105"
        style={{ background: "var(--glass)", borderColor: "var(--glass-border)", color: "var(--ink-2)" }}
      >
        {ICONS[theme]}
      </button>

      {open && (
        <div
          className="absolute top-12 right-0 z-10 flex w-36 flex-col gap-1 rounded-2xl border p-1.5"
          style={{
            background: "var(--glass-strong)",
            borderColor: "var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
          }}
        >
          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setTheme(mode);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--fill-subtle)]"
              style={{
                color: mode === theme ? "var(--ink)" : "var(--ink-2)",
                fontWeight: mode === theme ? 600 : 500,
              }}
            >
              {ICONS[mode]}
              {t.theme[mode]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
