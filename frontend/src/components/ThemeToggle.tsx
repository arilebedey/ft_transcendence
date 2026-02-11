/**
 * @component ThemeToggle
 * Bouton pour basculer entre mode light/dark.
 * - Affiche icône Sun en mode dark, Moon en mode light
 * - Stocke la préférence dans localStorage
 * - Applique la classe 'dark' au root HTML pour Tailwind
 * 
 * @hooks
 * - useTheme(): Utilitaire personnalisé pour gérer l'état du thème
 *   - Persiste en localStorage
 *   - Respecte prefers-color-scheme du système
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-secondary"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}