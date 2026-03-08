import { AlertTriangle, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import type { SimulatorLogItem } from '../../features/simulator/types/simulator.types';

type EventLogItemProps = {
  item: SimulatorLogItem;
};

const iconMap = {
  success: CheckCircle2,
  warning: Clock3,
  error: XCircle,
  info: AlertTriangle,
};

const colorMap = {
  success: {
    bg: 'var(--success-soft)',
    border: 'color-mix(in srgb, var(--success) 30%, var(--border))',
    text: 'var(--success)',
  },
  warning: {
    bg: 'var(--warning-soft)',
    border: 'color-mix(in srgb, var(--warning) 30%, var(--border))',
    text: 'var(--warning)',
  },
  error: {
    bg: 'var(--danger-soft)',
    border: 'color-mix(in srgb, var(--danger) 30%, var(--border))',
    text: 'var(--danger)',
  },
  info: {
    bg: 'var(--info-soft)',
    border: 'color-mix(in srgb, var(--info) 30%, var(--border))',
    text: 'var(--info)',
  },
};

function EventLogItem({ item }: EventLogItemProps) {
  const Icon = iconMap[item.severity];
  const colors = colorMap[item.severity];

  return (
    <article
      className="border px-5 py-5"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-2 flex items-center gap-3">
        <Icon size={18} style={{ color: colors.text }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-medium">{item.eventId}</span> &nbsp;•&nbsp; {item.category}
        </p>
      </div>

      <p className="text-xl font-medium" style={{ color: 'var(--text)' }}>
        {item.title}: {item.message}
      </p>

      <div className="mt-3 space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {item.referenceId && (
          <p>
            <span className="font-medium">Reference:</span> {item.referenceId}
          </p>
        )}

        {item.idempotencyKey && (
          <p>
            <span className="font-medium">Idempotency Key:</span> {item.idempotencyKey}
          </p>
        )}

        <p>{item.timestamp}</p>
      </div>
    </article>
  );
}

export default EventLogItem;