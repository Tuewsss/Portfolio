"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Mãe d'Água, PB
const LATITUDE = -7.25861;
const LONGITUDE = -37.42694;
const TIMEZONE = "America/Fortaleza";
const POLL_INTERVAL_MS = 15 * 60 * 1000;

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  isDay: boolean;
}

interface WeatherContextValue {
  weather: WeatherData | null;
  error: boolean;
}

const WeatherContext = createContext<WeatherContextValue>({ weather: null, error: false });

export function WeatherProvider({ children }: { children: ReactNode }) {
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
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return <WeatherContext.Provider value={{ weather, error }}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  return useContext(WeatherContext);
}
