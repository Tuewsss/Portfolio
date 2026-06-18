"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Profile } from "@/types/portfolio";

interface FooterProps {
  profile: Profile | null;
}

export function Footer({ profile }: FooterProps) {
  const { t } = useLanguage();
  const name = profile?.full_name ?? "Portfólio";
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] py-12 text-center text-sm" style={{ color: "var(--ink-3)" }}>
      <div className="mx-auto max-w-[1080px] px-6">
        <span className="brand mb-3.5 justify-center" style={{ color: "var(--ink)" }}>
          <span className="dot" />
          {name}
        </span>
        <div>
          © {year} — {t.footer.madeWith}
        </div>
      </div>
    </footer>
  );
}
