import type { ServiceHealthItem } from '../../features/observability/types/observability.types';
import ServiceStatusBadge from './ServiceStatusBadge';

type ServiceHealthCardProps = {
  item: ServiceHealthItem;
};

function ServiceHealthCard({ item }: ServiceHealthCardProps) {
  return (
    <article
      className="border p-5"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
          {item.name}
        </h2>

        <ServiceStatusBadge status={item.status} />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Uptime</span>
          <span className="font-medium" style={{ color: 'var(--text)' }}>
            {item.uptime}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Latency</span>
          <span className="font-medium" style={{ color: 'var(--text)' }}>
            {item.latency}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ServiceHealthCard;