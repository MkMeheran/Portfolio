"use client";
import { useEffect } from "react";
import theme from "@/data/theme.json";

export default function ThemeLoader() {
  useEffect(() => {
    if (typeof document === "undefined") return; // SSR safe

    const r = document.documentElement;
    if (theme?.colors) {
      Object.entries(theme.colors).forEach(([k, v]) =>
        r.style.setProperty(`--${k}`, String(v))
      );
    }
    if (theme.radius) r.style.setProperty("--radius", String(theme.radius));
    if (theme.shadow) r.style.setProperty("--shadow", String(theme.shadow));
  }, []);

  return null;
}
