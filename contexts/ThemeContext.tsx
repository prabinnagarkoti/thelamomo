"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeColors {
  primary: string;
  secondary: string;
  backgroundColor: string;
}

const ThemeContext = createContext<ThemeColors>({
  primary: "#f59e0b",
  secondary: "#e11d48",
  backgroundColor: "#020617"
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#f59e0b",
    secondary: "#e11d48",
    backgroundColor: "#020617"
  });

  useEffect(() => {
    fetch("/api/menu/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.config) {
          setColors({
            primary: d.config.primaryColor || "#f59e0b",
            secondary: d.config.secondaryColor || "#e11d48",
            backgroundColor: d.config.backgroundColor || "#020617"
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty("--secondary", colors.secondary);
    document.documentElement.style.setProperty("--bg-color", colors.backgroundColor);
  }, [colors]);

  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
