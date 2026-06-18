"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Skill } from "@/types/portfolio";

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const { t } = useLanguage();

  return (
    <section id="skills" className="relative z-[1] px-6 py-20">
      <div className="mx-auto max-w-[1080px]">
        <Reveal className="mb-12 max-w-xl">
          <span
            className="mb-3.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--accent-ink)" }}
          >
            {t.skills.label}
          </span>
          <h2 className="font-bold leading-[1.1] tracking-tight" style={{ fontSize: "clamp(30px, 4.5vw, 44px)" }}>
            {t.skills.title}
          </h2>
        </Reveal>

        <Reveal className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span key={skill.id} className="chip chip-lg">
              {skill.name}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
