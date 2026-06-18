"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { CalendarCard } from "@/components/panel/CalendarCard";
import { ClockCard } from "@/components/panel/ClockCard";
import { GitHubCard } from "@/components/panel/GitHubCard";
import { NowPlayingCard } from "@/components/panel/NowPlayingCard";
import { WeatherCard } from "@/components/panel/WeatherCard";
import { Reveal } from "@/components/Reveal";
import type { Profile } from "@/types/portfolio";

interface PanelProps {
  profile: Profile | null;
}

export function Panel({ profile }: PanelProps) {
  const { t } = useLanguage();

  return (
    <section id="painel" className="relative z-[1] px-6 py-20">
      <div className="mx-auto max-w-[1080px]">
        <Reveal className="mb-12 max-w-xl">
          <span
            className="mb-3.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--accent-ink)" }}
          >
            {t.panel.label}
          </span>
          <h2
            className="mb-3.5 font-bold leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(30px, 4.5vw, 44px)" }}
          >
            {t.panel.title}
          </h2>
          <p style={{ color: "var(--ink-2)", fontSize: "17px" }}>{t.panel.description}</p>
        </Reveal>

        <Reveal className="panel-bento">
          <NowPlayingCard />
          <ClockCard />
          <WeatherCard />
          <GitHubCard profile={profile} />
          <CalendarCard />
        </Reveal>
      </div>
    </section>
  );
}
