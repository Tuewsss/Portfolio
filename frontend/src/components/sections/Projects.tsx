"use client";

import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/types/portfolio";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const { t } = useLanguage();

  return (
    <section id="projetos" className="relative z-[1] px-6 py-20">
      <div className="mx-auto max-w-[1080px]">
        <Reveal className="mb-12 max-w-xl">
          <span
            className="mb-3.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--accent-ink)" }}
          >
            {t.projects.label}
          </span>
          <h2
            className="mb-3.5 font-bold leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(30px, 4.5vw, 44px)" }}
          >
            {t.projects.title}
          </h2>
          <p style={{ color: "var(--ink-2)", fontSize: "17px" }}>{t.projects.description}</p>
        </Reveal>

        {projects.length === 0 ? (
          <p style={{ color: "var(--ink-3)" }}>{t.projects.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 4) * 60} className={i === 0 ? "sm:col-span-2" : ""}>
                <GlassCard className="p-8">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ink-3)" }}>
                    {project.tag_display}
                  </span>
                  <h3 className="mt-3.5 mb-2.5 text-2xl font-semibold tracking-tight">{project.title}</h3>
                  <p className="max-w-[46ch] text-[15px]" style={{ color: "var(--ink-2)" }}>
                    {project.description}
                  </p>
                  {project.technologies.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech.id} className="chip">
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {i === 0 && <div className="project-art" />}
                </GlassCard>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
