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

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border bg-card p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            theme === t.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={t.label}
        >
          {t.icon}
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
