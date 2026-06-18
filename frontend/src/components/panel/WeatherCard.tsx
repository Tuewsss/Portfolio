"use client";

import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useWeather } from "@/components/providers/WeatherProvider";

export function WeatherCard() {
  const { t } = useLanguage();
  const { weather, error } = useWeather();

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
