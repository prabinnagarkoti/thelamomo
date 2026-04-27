"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeConfig {
  primary: string;
  secondary: string;
  backgroundColor: string;
  themeMode: string;
  fontFamily: string;
}

const defaultConfig: ThemeConfig = {
  primary: "#f59e0b",
  secondary: "#e11d48",
  backgroundColor: "#020617",
  themeMode: "dark",
  fontFamily: "inter"
};

const ThemeContext = createContext<ThemeConfig>(defaultConfig);

// Apply theme directly to DOM (called instantly to prevent flash)
function applyTheme(config: ThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty("--primary", config.primary);
  root.style.setProperty("--secondary", config.secondary);
  root.style.setProperty("--bg-color", config.backgroundColor);
  root.setAttribute("data-theme", config.themeMode);

  if (document.body) {
    if (config.fontFamily === "playfair") {
      document.body.style.fontFamily = "var(--font-display), serif";
    } else if (config.fontFamily === "mono") {
      document.body.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    } else {
      document.body.style.removeProperty("font-family");
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Try to read cached theme from localStorage immediately to avoid flash
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("bizmenu_theme");
        if (cached) return JSON.parse(cached) as ThemeConfig;
      } catch {}
    }
    return defaultConfig;
  });

  // Apply theme instantly on first render (before API call)
  useEffect(() => {
    applyTheme(config);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch fresh theme from API
  useEffect(() => {
    fetch("/api/menu/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.config) {
          const fresh: ThemeConfig = {
            primary: d.config.primaryColor || "#f59e0b",
            secondary: d.config.secondaryColor || "#e11d48",
            backgroundColor: d.config.backgroundColor || "#020617",
            themeMode: d.config.themeMode || "dark",
            fontFamily: d.config.fontFamily || "inter"
          };
          setConfig(fresh);
          localStorage.setItem("bizmenu_theme", JSON.stringify(fresh));
        }
      })
      .catch(() => {});
  }, []);

  // Apply theme whenever config changes
  useEffect(() => {
    applyTheme(config);
  }, [config]);

  return <ThemeContext.Provider value={config}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
