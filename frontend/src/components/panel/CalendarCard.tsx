"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface DayCell {
  day: number;
  muted: boolean;
  isToday: boolean;
}

export function CalendarCard() {
  const { t } = useLanguage();
  // A data real só existe no cliente; calculá-la direto no render causaria
  // um mismatch de hidratação entre servidor e cliente.
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data real só existe no cliente
    setToday(new Date());
  }, []);

  if (!today) {
    return <div className="glass-card panel-cal" />;
  }

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat(t.locale, { month: "long", year: "numeric" }).format(today);

  const cells: DayCell[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: 0, muted: true, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false, isToday: d === today.getDate() });
  }

  return (
    <GlassCard className="panel-cal">
      <div className="panel-cal-head">
        <span className="panel-cal-month">{monthLabel}</span>
        <span className="pico">{t.panel.calendar}</span>
      </div>
      <div className="panel-cal-grid">
        {t.panel.weekdays.map((letter, i) => (
          <span key={`dow-${i}`} className="dow">
            {letter}
          </span>
        ))}
        {cells.map((cell, i) => (
          <span key={`day-${i}`} className={`day ${cell.muted ? "muted" : ""} ${cell.isToday ? "today" : ""}`}>
            {cell.muted ? "" : cell.day}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
