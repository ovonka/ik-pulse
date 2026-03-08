import type { LucideIcon } from 'lucide-react';

type SettlementMetricCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
};

function SettlementMetricCard({
  title,
  value,
  icon: Icon,
  iconColor = 'var(--text-secondary)',
  iconBg = 'var(--surface-muted)',
}: SettlementMetricCardProps) {
  return (
    <article
      className="border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </p>

        <div
          className="flex h-10 w-10 items-center justify-center"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: iconBg,
          }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>

      <h3 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        {value}
      </h3>
    </article>
  );
}

export default SettlementMetricCard;