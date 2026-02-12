import { Trees, Moon, Sun } from "lucide-react";
import { type Theme, useThemeStore } from "@/stores/theme-store";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "forest", label: "Forest", icon: <Trees className="h-4 w-4" /> },
  {
    value: "dark-blue",
    label: "Dark Blue",
    icon: <Moon className="h-4 w-4" />,
  },
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="inline-flex items-center h-10 gap-1 rounded-lg border bg-card p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`inline-flex items-center justify-center rounded-md p-2 transition-colors ${
            theme === t.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
