import { create } from "zustand";

interface AuthUiState {
  isLoggingOut: boolean;
  beginLogout: () => void;
  endLogout: () => void;
}

export const useAuthUiStore = create<AuthUiState>((set) => ({
  isLoggingOut: false,
  beginLogout: () => set({ isLoggingOut: true }),
  endLogout: () => set({ isLoggingOut: false }),
}));
