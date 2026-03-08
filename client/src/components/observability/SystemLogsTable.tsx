import type { SystemLogItem } from '../../features/observability/types/observability.types';

type SystemLogsTableProps = {
  items: SystemLogItem[];
};

function getLevelColor(level: SystemLogItem['level']) {
  if (level === 'ERROR') return 'var(--danger)';
  if (level === 'WARN') return 'var(--warning)';
  return 'var(--text-secondary)';
}

function SystemLogsTable({ items }: SystemLogsTableProps) {
  return (
    <section
      className="overflow-hidden border"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="border-b px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
          Recent System Logs
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--text-secondary)' }}>
              <th className="px-4 py-4 text-left font-semibold">Log ID</th>
              <th className="px-4 py-4 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-4 text-left font-semibold">Level</th>
              <th className="px-4 py-4 text-left font-semibold">Service</th>
              <th className="px-4 py-4 text-left font-semibold">Message</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <td className="px-4 py-4 font-mono text-xs" style={{ color: 'var(--text)' }}>
                  {item.id}
                </td>
                <td className="px-4 py-4" style={{ color: 'var(--text-secondary)' }}>
                  {item.timestamp}
                </td>
                <td
                  className="px-4 py-4 font-semibold"
                  style={{ color: getLevelColor(item.level) }}
                >
                  {item.level}
                </td>
                <td className="px-4 py-4 font-mono" style={{ color: 'var(--text)' }}>
                  {item.service}
                </td>
                <td className="px-4 py-4" style={{ color: 'var(--text)' }}>
                  {item.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SystemLogsTable;