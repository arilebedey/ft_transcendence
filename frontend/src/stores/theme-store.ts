import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "forest" | "dark-blue" | "light";

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
        // setter
        document.documentElement.setAttribute("data-theme", theme); // sets the data-theme attribute of the html document for tailwind to read
        set({ theme });
      },
    }),
    {
      name: "app-theme",
      storage: createJSONStorage(() => localStorage), // saves/loads state in localStorage under this key
      onRehydrateStorage: () => (state) => {
        // runs before React renders
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
      version: 0, // for migrations ;)
    },
  ),
);
