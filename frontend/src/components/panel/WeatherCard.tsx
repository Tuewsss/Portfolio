"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/LanguageProvider";

// Mãe d'Água, PB
const LATITUDE = -7.25861;
const LONGITUDE = -37.42694;
const TIMEZONE = "America/Fortaleza";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  isDay: boolean;
}

export function WeatherCard() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
          `&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(TIMEZONE)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("weather fetch failed");
        const data = await res.json();
        if (cancelled) return;
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          tempMax: Math.round(data.daily.temperature_2m_max[0]),
          tempMin: Math.round(data.daily.temperature_2m_min[0]),
          isDay: data.current.is_day === 1,
        });
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const id = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const isOvercast = weather && weather.weatherCode > 3;
  const overcastStyle = isOvercast ? { background: "var(--ink-3)", boxShadow: "none" } : undefined;
  const condition = weather ? t.panel.weatherConditions[weather.weatherCode] ?? t.panel.weatherFallback : "";

  return (
    <GlassCard className="panel-weather">
      <div className="panel-w-row">
        <div className="pico">{t.panel.weatherNow}</div>
        {weather && !weather.isDay ? (
          <div className="panel-moon" style={overcastStyle} />
        ) : (
          <div className="panel-sun" style={overcastStyle} />
        )}
      </div>
      <div>
        {weather ? (
          <>
            <div className="panel-temp">
              {weather.temperature}
              <span className="panel-temp-unit">°C</span>
            </div>
            <div className="panel-w-cond">{condition}</div>
            <div className="panel-w-minmax">
              {t.panel.weatherMax} {weather.tempMax}° · {t.panel.weatherMin} {weather.tempMin}°
            </div>
          </>
        ) : (
          <div className="panel-w-cond">{error ? t.panel.weatherUnavailable : t.panel.weatherLoading}</div>
        )}
      </div>
    </GlassCard>
  );
}
