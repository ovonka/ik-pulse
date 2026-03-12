import type { SettlementItem } from '../../features/merchant-ops/types/merchantOps.types';
import { formatZar } from '../../features/merchant-ops/utils/formatCurrency';

type SettlementHistoryTableProps = {
  items: SettlementItem[];
};

function formatDateTime(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

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
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
          Settlement History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--text-secondary)' }}>
              <th className="px-6 py-4 text-left font-semibold">Provider Ref</th>
              <th className="px-6 py-4 text-left font-semibold">Provider</th>
              <th className="px-6 py-4 text-left font-semibold">Gross</th>
              <th className="px-6 py-4 text-left font-semibold">Fees</th>
              <th className="px-6 py-4 text-left font-semibold">Net</th>
              <th className="px-6 py-4 text-left font-semibold">Transactions</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Scheduled</th>
              <th className="px-6 py-4 text-left font-semibold">Settled</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                  {item.providerSettlementRef ?? '—'}
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                  {item.provider}
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                  {formatZar(item.grossAmount)}
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                  {formatZar(item.feeAmount)}
                </td>
                <td className="px-6 py-4 font-medium" style={{ color: 'var(--text)' }}>
                  {formatZar(item.netAmount)}
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                  {item.transactionCount}
                </td>
                <td className="px-6 py-4 capitalize" style={{ color: 'var(--text)' }}>
                  {item.status}
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>
                  {formatDateTime(item.scheduledFor)}
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>
                  {formatDateTime(item.settledAt)}
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