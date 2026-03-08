import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  const savedTheme = localStorage.getItem('ikpulse-theme') as ThemeMode | null;
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  if (typeof window.matchMedia !== 'function') return 'light';

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('ikpulse-theme', theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('ikpulse-theme', nextTheme);
      return { theme: nextTheme };
    }),
}));