"use client";

import { HeroGreeting } from "@/components/sections/HeroGreeting";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Profile } from "@/types/portfolio";

interface HeroProps {
  profile: Profile | null;
}

export function Hero({ profile }: HeroProps) {
  const { t } = useLanguage();
  const available = profile?.available_for_work ?? true;
  const tagline = profile?.tagline || "Desenvolvedor full stack focado em desenvolvimento Web.";

  return (
    <header className="relative z-[1] px-6 pt-44 pb-28 text-center">
      <Reveal>
        <span className="eyebrow">
          <span className={`live ${available ? "" : "off"}`} />
          {available ? t.hero.available : t.hero.unavailable}
        </span>
      </Reveal>

      <Reveal delay={60}>
        <HeroGreeting />
      </Reveal>

      <Reveal delay={120}>
        <p
          className="mx-auto mb-10 max-w-xl"
          style={{ fontSize: "clamp(17px, 2.4vw, 21px)", color: "var(--ink-2)" }}
        >
          {tagline}
        </p>
      </Reveal>

      <Reveal delay={180}>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#projetos" className="btn btn-primary">
            {t.hero.ctaProjects}
          </a>
          <a href="#contato" className="btn btn-glass">
            {t.hero.ctaContact}
          </a>
        </div>
      </Reveal>
    </header>
  );
}
