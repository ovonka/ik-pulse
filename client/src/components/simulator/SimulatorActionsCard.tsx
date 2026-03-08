import { CheckCircle2, Copy, Clock3, XCircle } from 'lucide-react';
import type { SimulatorEventType } from '../../features/simulator/types/simulator.types';

type SimulatorActionsCardProps = {
  onSimulate: (type: SimulatorEventType) => void;
};

const actions: {
  label: string;
  type: SimulatorEventType;
  icon: typeof CheckCircle2;
  color: string;
}[] = [
  {
    label: 'Payment Success',
    type: 'payment-success',
    icon: CheckCircle2,
    color: 'var(--success)',
  },
  {
    label: 'Payment Failure',
    type: 'payment-failure',
    icon: XCircle,
    color: 'var(--danger)',
  },
  {
    label: 'Duplicate Webhook',
    type: 'duplicate-webhook',
    icon: Copy,
    color: 'var(--warning)',
  },
  {
    label: 'Delayed Settlement',
    type: 'delayed-settlement',
    icon: Clock3,
    color: 'var(--warning)',
  },
];

function SimulatorActionsCard({ onSimulate }: SimulatorActionsCardProps) {
  return (
    <section
      className="border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <h2 className="mb-6 text-3xl font-semibold" style={{ color: 'var(--text)' }}>
        Simulate Events
      </h2>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.type}
              type="button"
              onClick={() => onSimulate(action.type)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-4 text-left transition hover:opacity-85"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <Icon size={18} style={{ color: action.color }} />
              <span className="font-medium" style={{ color: 'var(--text)' }}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SimulatorActionsCard;