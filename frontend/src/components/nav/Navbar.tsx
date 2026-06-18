"use client";

import { LanguageSwitcher } from "@/components/nav/LanguageSwitcher";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ThemeSwitcher } from "@/components/nav/ThemeSwitcher";
import type { Profile } from "@/types/portfolio";

interface NavbarProps {
  profile: Profile | null;
}

export function Navbar({ profile }: NavbarProps) {
  const { t } = useLanguage();
  const name = profile?.full_name ?? "Portfólio";

  return (
    <nav className="site-nav">
      <a href="#top" className="brand">
        <span className="dot" />
        {name}
      </a>
      <div className="nav-links">
        <a href="#projetos">{t.nav.projects}</a>
        <a href="#sobre">{t.nav.about}</a>
        <a href="#skills">{t.nav.skills}</a>
        <a href="#painel">{t.nav.panel}</a>
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <a href="#contato" className="nav-cta">
          {t.nav.contact}
        </a>
      </div>
    </nav>
  );
}
