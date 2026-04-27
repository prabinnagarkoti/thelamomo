"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeConfig {
  primary: string;
  secondary: string;
  backgroundColor: string;
  themeMode: string;
  fontFamily: string;
}

const ThemeContext = createContext<ThemeConfig>({
  primary: "#f59e0b",
  secondary: "#e11d48",
  backgroundColor: "#020617",
  themeMode: "dark",
  fontFamily: "inter"
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>({
    primary: "#f59e0b",
    secondary: "#e11d48",
    backgroundColor: "#020617",
    themeMode: "dark",
    fontFamily: "inter"
  });

  useEffect(() => {
    fetch("/api/menu/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.config) {
          setConfig({
            primary: d.config.primaryColor || "#f59e0b",
            secondary: d.config.secondaryColor || "#e11d48",
            backgroundColor: d.config.backgroundColor || "#020617",
            themeMode: d.config.themeMode || "dark",
            fontFamily: d.config.fontFamily || "inter"
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", config.primary);
    document.documentElement.style.setProperty("--secondary", config.secondary);
    document.documentElement.style.setProperty("--bg-color", config.backgroundColor);
    document.documentElement.setAttribute("data-theme", config.themeMode);
    
    if (typeof document !== 'undefined' && document.body) {
      if (config.fontFamily === 'playfair') {
        document.body.style.setProperty("font-family", "var(--font-display), serif");
      } else if (config.fontFamily === 'mono') {
        document.body.style.setProperty("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace");
      } else {
        document.body.style.removeProperty("font-family");
      }
    }
  }, [config]);

  return <ThemeContext.Provider value={config}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
