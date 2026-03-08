import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../app/store/themeStore';

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition hover:opacity-90 cursor-pointer"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
        borderColor: 'var(--border)',
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;