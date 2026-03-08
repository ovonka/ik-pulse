import { Zap } from 'lucide-react';

function SimulatorEmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--surface-muted)' }}
      >
        <Zap size={30} style={{ color: 'var(--text-muted)' }} />
      </div>

      <h3 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
        No simulated events yet
      </h3>

      <p className="mt-3 max-w-md text-sm" style={{ color: 'var(--text-muted)' }}>
        Trigger a payment, webhook, or settlement event to populate the internal log stream.
      </p>
    </div>
  );
}

export default SimulatorEmptyState;