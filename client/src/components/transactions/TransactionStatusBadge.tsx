import type { TransactionStatus } from '../../features/transactions/types/transactions.types';

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
};

const badgeMap = {
  success: {
    label: 'Success',
    textColor: 'var(--success)',
    bgColor: 'var(--success-soft)',
  },
  failed: {
    label: 'Failed',
    textColor: 'var(--danger)',
    bgColor: 'var(--danger-soft)',
  },
  pending: {
    label: 'Pending',
    textColor: 'var(--warning)',
    bgColor: 'var(--warning-soft)',
  },
};

function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
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

export default TransactionStatusBadge;