"use client";

import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Project } from "@/types/portfolio";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const { t } = useLanguage();
  const media = project.media ?? [];

  return (
    <article className="relative z-[1] mx-auto max-w-[860px] px-6 pt-44 pb-24">
      <Link
        href="/#projetos"
        className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--ink-2)" }}
      >
        ← {t.projectDetail.back}
      </Link>

      <span className="block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-ink)" }}>
        {project.tag_display}
      </span>
      <h1 className="mt-3.5 mb-5 font-bold tracking-tight" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
        {project.title}
      </h1>

      {project.image && (
        <div className="relative mb-8 h-72 w-full overflow-hidden rounded-[var(--r-lg)] sm:h-96">
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
        </div>
      )}

      <p className="mb-8 text-lg" style={{ color: "var(--ink-2)" }}>
        {project.description}
      </p>

      {project.technologies.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech.id} className="chip chip-lg">
              {tech.name}
            </span>
          ))}
        </div>
      )}

      {(project.project_url || project.repo_url) && (
        <div className="mb-16 flex flex-wrap gap-3">
          {project.project_url && (
            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {t.projectDetail.liveLink} →
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
              {t.projectDetail.repoLink}
            </a>
          )}
        </div>
      )}

      {media.length > 0 && (
        <div>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">{t.projectDetail.gallery}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {media.map((item) => (
              <GlassCard key={item.id} className="overflow-hidden p-2">
                <div className="relative h-56 w-full overflow-hidden rounded-[var(--r-md)]">
                  <Image
                    src={item.image}
                    alt={item.caption || project.title}
                    fill
                    className="object-cover"
                    unoptimized={item.image.toLowerCase().endsWith(".gif")}
                  />
                </div>
                {item.caption && (
                  <p className="mt-2 px-2 pb-1 text-sm" style={{ color: "var(--ink-3)" }}>
                    {item.caption}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
