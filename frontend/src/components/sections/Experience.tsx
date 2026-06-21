"use client";

import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Experience as ExperienceType } from "@/types/portfolio";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export function Experience({ experiences }: ExperienceProps) {
  const { t } = useLanguage();

  if (experiences.length === 0) return null;

  const formatter = new Intl.DateTimeFormat(t.locale, { month: "short", year: "numeric" });
  const workExperiences = experiences.filter((exp) => exp.category !== "education");
  const academicExperiences = experiences.filter((exp) => exp.category === "education");

  function renderCard(exp: ExperienceType, i: number) {
    const start = formatter.format(new Date(`${exp.start_date}T00:00:00`));
    const end = exp.end_date ? formatter.format(new Date(`${exp.end_date}T00:00:00`)) : t.experience.current;

    return (
      <Reveal key={exp.id} delay={i * 60}>
        <GlassCard className="p-8 sm:flex sm:items-start sm:gap-6">
          {exp.logo && (
            <div
              className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[var(--r-md)] sm:mb-0"
              style={{ background: "var(--glass)" }}
            >
              <Image
                src={exp.logo}
                alt={exp.company}
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-contain p-2"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{exp.role || exp.company}</h3>
              <span className="text-xs whitespace-nowrap" style={{ color: "var(--ink-3)" }}>
                {start} – {end}
              </span>
            </div>
            {exp.role && (
              <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                {exp.company}
              </p>
            )}
            <p className="mt-3 max-w-[62ch] text-[15px]" style={{ color: "var(--ink-2)" }}>
              {exp.description}
            </p>
            {exp.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span key={tech.id} className="chip">
                    {tech.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </Reveal>
    );
  }

  return (
    <section id="experiencia" className="relative z-[1] px-6 py-20">
      <div className="mx-auto max-w-[1080px]">
        <Reveal className="mb-12 max-w-xl">
          <span
            className="mb-3.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--accent-ink)" }}
          >
            {t.experience.label}
          </span>
          <h2
            className="mb-3.5 font-bold leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(30px, 4.5vw, 44px)" }}
          >
            {t.experience.title}
          </h2>
          <p style={{ color: "var(--ink-2)", fontSize: "17px" }}>{t.experience.description}</p>
        </Reveal>

        {workExperiences.length > 0 && (
          <div className="mb-12">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--ink-3)" }}>
              {t.experience.workTitle}
            </h3>
            <div className="grid grid-cols-1 gap-5">{workExperiences.map((exp, i) => renderCard(exp, i))}</div>
          </div>
        )}

        {academicExperiences.length > 0 && (
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--ink-3)" }}>
              {t.experience.educationTitle}
            </h3>
            <div className="grid grid-cols-1 gap-5">{academicExperiences.map((exp, i) => renderCard(exp, i))}</div>
          </div>
        )}
      </div>
    </section>
  );
}
