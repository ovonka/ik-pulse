import type { ServiceHealthStatus } from '../../features/observability/types/observability.types';

type ServiceStatusBadgeProps = {
  status: ServiceHealthStatus;
};

const badgeMap = {
  healthy: {
    label: 'Healthy',
    textColor: 'var(--success)',
    bgColor: 'var(--success-soft)',
  },
  degraded: {
    label: 'Degraded',
    textColor: 'var(--warning)',
    bgColor: 'var(--warning-soft)',
  },
};

function ServiceStatusBadge({ status }: ServiceStatusBadgeProps) {
  const config = badgeMap[status];

  return (
    <span
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium"
      style={{
        color: config.textColor,
        backgroundColor: config.bgColor,
      }}
    >
      {config.label}
    </span>
  );
}

export default ServiceStatusBadge;