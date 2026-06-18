"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getGitHubStats } from "@/lib/api";
import type { GitHubStats, Profile } from "@/types/portfolio";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34C26",
  CSS: "#264DE4",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Shell: "#89E051",
  Vue: "#41B883",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

function colorFor(language: string) {
  return LANGUAGE_COLORS[language] ?? "var(--ink-3)";
}

function buildConicGradient(entries: [string, number][]) {
  if (entries.length === 0) return "var(--line)";
  let cursor = 0;
  const stops = entries.map(([lang, pct]) => {
    const start = cursor;
    cursor += pct;
    return `${colorFor(lang)} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function usernameFromUrl(url?: string) {
  if (!url) return null;
  const match = url.replace(/\/+$/, "").match(/github\.com\/([^/]+)/i);
  return match ? match[1] : null;
}

interface GitHubCardProps {
  profile: Profile | null;
}

export function GitHubCard({ profile }: GitHubCardProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getGitHubStats();
        if (!cancelled) setStats(data.total_commits !== undefined ? (data as GitHubStats) : null);
      } catch {
        if (!cancelled) setStats(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const languages = stats ? Object.entries(stats.languages).slice(0, 5) : [];
  const username = usernameFromUrl(profile?.github_url);

  return (
    <GlassCard className="panel-git">
      <div className="panel-git-head">
        <span className="panel-git-user">{username ? `@${username}` : t.panel.github}</span>
        <span className="pico">{t.panel.github}</span>
      </div>

      <div className="panel-git-body">
        <div className="panel-donut" style={{ background: buildConicGradient(languages) }} />
        <div className="panel-legend">
          {languages.length > 0 ? (
            languages.map(([lang, pct]) => (
              <div key={lang} className="panel-leg">
                <span className="sw" style={{ background: colorFor(lang) }} />
                <span className="name">{lang}</span>
                <span className="pct">{pct}%</span>
              </div>
            ))
          ) : (
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>
              {t.panel.githubNoData}
            </span>
          )}
        </div>
      </div>

      <div className="panel-git-stats">
        <div>
          <div className="panel-stat-num">{stats?.total_repos ?? "–"}</div>
          <div className="panel-stat-label">{t.panel.repos}</div>
        </div>
        <div>
          <div className="panel-stat-num">{stats?.total_stars ?? "–"}</div>
          <div className="panel-stat-label">{t.panel.stars}</div>
        </div>
        <div>
          <div className="panel-stat-num">{stats?.total_commits ?? "–"}</div>
          <div className="panel-stat-label">{t.panel.commits}</div>
        </div>
      </div>
    </GlassCard>
  );
}
