import { Menu } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';
import { useUIStore } from '../app/store/uiStore';

type TopbarProps = {
  title: string;
  subtitle?: string;
};

function Topbar({ title, subtitle }: TopbarProps) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between border-b px-4 py-4 md:px-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-xl border p-2 lg:hidden"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
          }}
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}

export default Topbar;