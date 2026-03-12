import type { LucideIcon } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
};

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'neutral',
  icon: Icon,
  isActive = false,
  onClick,
}: MetricCardProps) {
  const trendColor =
    trendType === 'positive'
      ? 'var(--success)'
      : trendType === 'negative'
        ? 'var(--danger)'
        : 'var(--text-muted)';

  return (
    <article
      className="cursor-pointer border p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: isActive ? 'var(--primary)' : 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center"
          style={{
            backgroundColor: 'var(--surface-muted)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Icon size={26} style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      <div>
        <h3
          className="wrap-break-word text-3xl font-bold tracking-tight xl:text-4xl"
          style={{ color: 'var(--text)' }}
        >
          {value}
</h3>

        {trend && (
          <p className="mt-2 text-sm" style={{ color: trendColor }}>
            {trend}
          </p>
        )}

        {subtitle && (
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </article>
  );
}

export default MetricCard;