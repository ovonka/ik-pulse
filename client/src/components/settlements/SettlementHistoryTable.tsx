import type { SettlementHistoryItem } from '../../features/settlements/types/settlements.types';
import SettlementStatusBadge from './SettlementStatusBadge';

type SettlementHistoryTableProps = {
  items: SettlementHistoryItem[];
};

function SettlementHistoryTable({ items }: SettlementHistoryTableProps) {
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
          Settlement History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--text-secondary)' }}>
              <th className="px-4 py-4 text-left font-semibold">Settlement ID</th>
              <th className="px-4 py-4 text-left font-semibold">Amount</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Scheduled Date</th>
              <th className="px-4 py-4 text-left font-semibold">Actual Date</th>
              <th className="px-4 py-4 text-left font-semibold">Transaction Count</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <td className="px-4 py-4" style={{ color: 'var(--text)' }}>
                  {item.id}
                </td>
                <td className="px-4 py-4 font-medium" style={{ color: 'var(--text)' }}>
                  R{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-4">
                  <SettlementStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-4" style={{ color: 'var(--text-secondary)' }}>
                  {item.scheduledDate}
                </td>
                <td className="px-4 py-4" style={{ color: 'var(--text-secondary)' }}>
                  {item.actualDate}
                </td>
                <td className="px-4 py-4" style={{ color: 'var(--text)' }}>
                  {item.transactionCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SettlementHistoryTable;