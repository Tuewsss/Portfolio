"use client";

import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Profile } from "@/types/portfolio";

interface AboutProps {
  profile: Profile | null;
}

export function About({ profile }: AboutProps) {
  const { t } = useLanguage();
  const paragraphs = (profile?.bio || "").split("\n\n").filter(Boolean);
  const stats = [
    { num: profile?.years_experience, lbl: t.about.yearsExperience, suffix: "+" },
    { num: profile?.projects_delivered, lbl: t.about.projectsDelivered, suffix: "+" },
    { num: profile?.recurring_clients, lbl: t.about.recurringClients, suffix: "" },
  ];

  return (
    <section id="sobre" className="relative z-[1] px-6 py-20">
      <div className="mx-auto max-w-[1080px]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <GlassCard className="h-full p-10">
              <h2 className="mb-4.5 text-3xl font-bold tracking-tight">{t.about.title}</h2>
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} className="mb-3.5 text-base" style={{ color: "var(--ink-2)" }}>
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-base" style={{ color: "var(--ink-2)" }}>
                  {t.about.emptyBio}
                </p>
              )}
            </GlassCard>
          </Reveal>

          <Reveal delay={80}>
            <GlassCard className="flex h-full flex-col justify-center gap-7 p-10">
              {stats.map((s) => (
                <div key={s.lbl}>
                  <div className="stat-num">
                    {s.num ?? 0}
                    {s.suffix}
                  </div>
                  <div className="mt-0.5 text-sm" style={{ color: "var(--ink-3)" }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
