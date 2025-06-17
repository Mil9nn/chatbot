import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isLight: false,

      toggleTheme: () =>
        set((state) => ({
          isLight: !state.isLight,
        })),
    }),
    {
      name: 'theme-storage', // key in localStorage
    }
  )
);
