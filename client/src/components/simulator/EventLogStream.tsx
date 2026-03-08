import { Zap } from 'lucide-react';
import type { SimulatorLogItem } from '../../features/simulator/types/simulator.types';
import EventLogItem from './EventLogItem';
import SimulatorEmptyState from './SimulatorEmptyState';

type EventLogStreamProps = {
  logs: SimulatorLogItem[];
  onClearLogs: () => void;
};

function EventLogStream({ logs, onClearLogs }: EventLogStreamProps) {
  return (
    <section
      className="border"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        className="flex items-center justify-between border-b px-6 py-5"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <Zap size={20} style={{ color: 'var(--text)' }} />
          <h2 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
            Event Log Stream
          </h2>
        </div>

        <button
          type="button"
          onClick={onClearLogs}
          className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-85"
          style={{
            color: 'var(--text)',
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          Clear Logs
        </button>
      </div>

      {logs.length === 0 ? (
        <SimulatorEmptyState />
      ) : (
        <div className="space-y-4 p-6">
          {logs.map((item) => (
            <EventLogItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default EventLogStream;