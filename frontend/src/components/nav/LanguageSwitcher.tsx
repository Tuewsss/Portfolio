"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";

function flagUrl(country: string) {
  return `https://flagcdn.com/48x36/${country}.png`;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
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

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Selecionar idioma"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-transform hover:scale-105"
        style={{ background: "var(--glass)", borderColor: "var(--glass-border)" }}
      >
        <Image
          src={flagUrl(current.country)}
          alt={current.label}
          width={24}
          height={18}
          className="h-[18px] w-6 rounded-[3px] object-cover"
        />
      </button>

      {open && (
        <div
          className="absolute top-12 right-0 z-10 flex w-40 flex-col gap-1 rounded-2xl border p-1.5"
          style={{
            background: "var(--glass-strong)",
            borderColor: "var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--fill-subtle)]"
              style={{
                color: l.code === language ? "var(--ink)" : "var(--ink-2)",
                fontWeight: l.code === language ? 600 : 500,
              }}
            >
              <Image
                src={flagUrl(l.country)}
                alt={l.label}
                width={20}
                height={15}
                className="h-[15px] w-5 rounded-[2px] object-cover"
              />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
