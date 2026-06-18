"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/LanguageProvider";

const TIMEZONE = "America/Fortaleza";
const PLACE_LABEL = "Mãe d'Água, PB · GMT-3";

export function ClockCard() {
  const { t } = useLanguage();
  // A hora real só existe no cliente; calculá-la direto no render causaria
  // um mismatch de hidratação entre servidor e cliente.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    function tick() {
      setNow(new Date());
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hm = now
    ? new Intl.DateTimeFormat(t.locale, {
        timeZone: TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--";
  const ss = now
    ? new Intl.DateTimeFormat(t.locale, { timeZone: TIMEZONE, second: "2-digit" }).format(now).padStart(2, "0")
    : "00";
  const date = now
    ? new Intl.DateTimeFormat(t.locale, {
        timeZone: TIMEZONE,
        weekday: "long",
        day: "2-digit",
        month: "long",
      }).format(now)
    : "—";

  return (
    <GlassCard className="panel-clock">
      <div className="pico">{t.panel.localTime}</div>
      <div>
        <div className="panel-time">
          {hm}
          <span className="sec">{ss}</span>
        </div>
        <div className="panel-date">{date}</div>
        <div className="panel-place">{PLACE_LABEL}</div>
      </div>
    </GlassCard>
  );
}
