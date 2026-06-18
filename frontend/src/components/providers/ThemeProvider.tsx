"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useWeather } from "@/components/providers/WeatherProvider";
import { moodForWeatherCode } from "@/lib/weatherMood";
import { useStoredState } from "@/lib/useStoredState";

export type ThemeMode = "white" | "dark" | "weather";

const THEME_KEY = "portfolio:theme";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "white" || value === "dark" || value === "weather";
}

function readTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return isThemeMode(stored) ? stored : "white";
  } catch {
    return "white";
  }
}

function writeTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage indisponível (ex: modo privado)
  }
}

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useStoredState<ThemeMode>("white", readTheme, writeTheme);
  const { weather } = useWeather();

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "weather" && weather) {
      root.setAttribute("data-theme", "weather");
      root.setAttribute("data-weather-mood", moodForWeatherCode(weather.weatherCode));
      root.setAttribute("data-weather-time", weather.isDay ? "day" : "night");
    } else if (theme === "weather") {
      // clima ainda não carregou: usa o claro como base até os dados chegarem
      root.setAttribute("data-theme", "white");
      root.removeAttribute("data-weather-mood");
      root.removeAttribute("data-weather-time");
    } else {
      root.setAttribute("data-theme", theme);
      root.removeAttribute("data-weather-mood");
      root.removeAttribute("data-weather-time");
    }
  }, [theme, weather]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
