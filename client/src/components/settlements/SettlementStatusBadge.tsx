import type { SettlementStatus } from '../../features/settlements/types/settlements.types';

type SettlementStatusBadgeProps = {
  status: SettlementStatus;
};

const badgeMap = {
  completed: {
    label: 'Completed',
    textColor: 'var(--success)',
    bgColor: 'var(--success-soft)',
  },
  pending: {
    label: 'Pending',
    textColor: 'var(--warning)',
    bgColor: 'var(--warning-soft)',
  },
  delayed: {
    label: 'Delayed',
    textColor: 'var(--warning)',
    bgColor: 'var(--warning-soft)',
  },
};

function SettlementStatusBadge({ status }: SettlementStatusBadgeProps) {
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

export default SettlementStatusBadge;