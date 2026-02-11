/**
 * @hook useTheme
 * Hook pour gérer le thème light/dark de l'application.
 * 
 * @behavior
 * 1. Initialisation:
 *    - Récupère localStorage["theme"] s'il existe
 *    - Sinon, check prefers-color-scheme du système
 *    - Par défaut: "light"
 * 
 * 2. Effets:
 *    - Applique classe 'light' ou 'dark' à <html>
 *    - Persist la sélection dans localStorage
 * 
 * @returns
 * - theme: "light" | "dark" - Thème actuel
 * - setTheme: (t: Theme) => void - Setter manuel
 * - toggleTheme: () => void - Basculer theme
 */

import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}
