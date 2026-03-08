import type { SimulatorStats } from '../../features/simulator/types/simulator.types';

type SimulatorStatsCardProps = {
  stats: SimulatorStats;
};

function SimulatorStatsCard({ stats }: SimulatorStatsCardProps) {
  return (
    <section
      className="border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <h2 className="mb-10 text-3xl font-semibold" style={{ color: 'var(--text)' }}>
        Event Statistics
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Total Events</span>
          <span className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
            {stats.totalEvents}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Success</span>
          <span className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>
            {stats.success}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Warnings</span>
          <span className="text-2xl font-semibold" style={{ color: 'var(--warning)' }}>
            {stats.warnings}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Errors</span>
          <span className="text-2xl font-semibold" style={{ color: 'var(--danger)' }}>
            {stats.errors}
          </span>
        </div>
      </div>
    </section>
  );
}

export default SimulatorStatsCard;