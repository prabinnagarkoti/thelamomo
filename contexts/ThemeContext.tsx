"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<{ primary: string; secondary: string }>({
    primary: "#f59e0b",
    secondary: "#e11d48"
  });

  useEffect(() => {
    fetch("/api/menu/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.config) setColors({ primary: d.config.primaryColor, secondary: d.config.secondaryColor }); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty("--secondary", colors.secondary);
  }, [colors]);

  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
