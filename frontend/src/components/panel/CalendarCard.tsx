"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getCalendarEntries, getGitHubStats } from "@/lib/api";
import type { CalendarEntry } from "@/types/portfolio";

interface DayCell {
  day: number;
  muted: boolean;
  isToday: boolean;
  dateKey: string | null;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function dateKeyFor(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

// Faixas fixas (não relativas ao próprio histórico) pra intensidade ficar
// previsível mesmo em meses com poucos dados ainda.
function commitLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function CalendarCard() {
  const { t } = useLanguage();
  // A data real só existe no cliente; calculá-la direto no render causaria
  // um mismatch de hidratação entre servidor e cliente.
  const [today, setToday] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState<number | null>(null);
  const [viewMonth, setViewMonth] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<string, CalendarEntry>>({});
  const [contributions, setContributions] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    getGitHubStats()
      .then((data) => {
        if (!cancelled) setContributions(data.contributions ?? {});
      })
      .catch(() => {
        if (!cancelled) setContributions({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    /* eslint-disable react-hooks/set-state-in-effect -- data real só existe no cliente */
    setToday(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (viewYear === null || viewMonth === null) return;
    let cancelled = false;

    getCalendarEntries(viewYear, viewMonth)
      .then((data) => {
        if (cancelled) return;
        const map: Record<string, CalendarEntry> = {};
        for (const entry of data) map[entry.date] = entry;
        setEntries(map);
      })
      .catch(() => {
        if (!cancelled) setEntries({});
      });

    return () => {
      cancelled = true;
    };
  }, [viewYear, viewMonth]);

  function goToPrevMonth() {
    if (viewYear === null || viewMonth === null) return;
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goToNextMonth() {
    if (viewYear === null || viewMonth === null) return;
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  if (!today || viewYear === null || viewMonth === null) {
    return <div className="glass-card panel-cal" />;
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat(t.locale, { month: "long", year: "numeric" }).format(
    new Date(viewYear, viewMonth, 1),
  );

  // Sempre 42 células (6 semanas) — assim o card nunca muda de altura
  // dependendo de quantos dias/linhas o mês precisa.
  const cells: DayCell[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: 0, muted: true, isToday: false, dateKey: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      muted: false,
      isToday: viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate(),
      dateKey: dateKeyFor(viewYear, viewMonth, d),
    });
  }
  while (cells.length < 42) {
    cells.push({ day: 0, muted: true, isToday: false, dateKey: null });
  }

  return (
    <GlassCard className="panel-cal">
      <div className="panel-cal-head">
        <div className="panel-cal-nav">
          <button type="button" onClick={goToPrevMonth} aria-label="Mês anterior" className="panel-cal-arrow">
            ‹
          </button>
          <span className="panel-cal-month">{monthLabel}</span>
          <button type="button" onClick={goToNextMonth} aria-label="Próximo mês" className="panel-cal-arrow">
            ›
          </button>
        </div>
        <span className="pico">{t.panel.calendar}</span>
      </div>
      <div className="panel-cal-grid">
        {t.panel.weekdays.map((letter, i) => (
          <span key={`dow-${i}`} className="dow">
            {letter}
          </span>
        ))}
        {cells.map((cell, i) => {
          const entry = cell.dateKey ? entries[cell.dateKey] : undefined;
          const commitCount = cell.dateKey ? contributions[cell.dateKey] ?? 0 : 0;
          const level = commitLevel(commitCount);
          // Perto das bordas do grid (7 colunas) o tooltip centralizado vaza
          // pra fora do card, que tem overflow:hidden — ancora pro lado de dentro.
          const col = i % 7;
          const tipEdge = col <= 1 ? "tip-left" : col >= 5 ? "tip-right" : "";
          return (
            <span key={`day-${i}`} className={`day-cell ${tipEdge}`}>
              <span
                className={`day ${cell.muted ? "muted" : ""} ${cell.isToday ? "today" : ""} ${level > 0 ? `commit-${level}` : ""}`}
              >
                {cell.muted ? "" : cell.day}
              </span>
              {(entry || commitCount > 0) && (
                <>
                  {entry && <span className="day-dot" />}
                  <div className="day-tooltip">
                    {entry && (
                      <>
                        <strong>{entry.title}</strong>
                        {entry.description && <p>{entry.description}</p>}
                      </>
                    )}
                    {commitCount > 0 && (
                      <p>
                        {commitCount} {commitCount === 1 ? t.panel.contributionOne : t.panel.contributionOther}
                      </p>
                    )}
                  </div>
                </>
              )}
            </span>
          );
        })}
      </div>
    </GlassCard>
  );
}
