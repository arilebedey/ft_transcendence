import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "earth" | "forest" | "dark-blue" | "light";

const themeBackgrounds: Record<Theme, string> = {
  earth: "#2f241d",
  forest: "#1a2e1a",
  "dark-blue": "#0c1222",
  light: "#f8f9fa",
};

function applyThemeToDocument(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.backgroundColor = themeBackgrounds[theme];
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  // https://zustand.docs.pmnd.rs/integrations/persisting-store-data
  persist(
    (set) => ({
      // creates the store and default value
      theme: "light",
      setTheme: (theme) => {
        applyThemeToDocument(theme);
        set({ theme });
      },
    }),
    {
      name: "app-theme",
      storage: createJSONStorage(() => localStorage), // saves/loads state in localStorage under this key
      onRehydrateStorage: () => (state) => {
        // runs before React renders
        if (state?.theme) {
          applyThemeToDocument(state.theme);
        }
      },
      version: 0, // for migrations ;)
    },
  ),
);
