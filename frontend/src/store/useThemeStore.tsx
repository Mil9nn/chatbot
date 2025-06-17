import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isLight: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isLight: false,
      toggleTheme: () =>
        set((state) => ({
          isLight: !state.isLight,
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
