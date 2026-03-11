import { RotateCcw } from 'lucide-react';
import type { TransactionItem } from '../../features/merchant-ops/types/merchantOps.types';
import { formatZar } from '../../features/merchant-ops/utils/formatCurrency';

type TransactionTableProps = {
  items: TransactionItem[];
  onRetry?: (transactionId: string) => void;
};

function TransactionTable({ items, onRetry }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr style={{ color: 'var(--text-secondary)' }}>
            <th className="px-6 py-4 text-left font-semibold">Provider Ref</th>
            <th className="px-6 py-4 text-left font-semibold">Provider</th>
            <th className="px-6 py-4 text-left font-semibold">Amount</th>
            <th className="px-6 py-4 text-left font-semibold">Status</th>
            <th className="px-6 py-4 text-left font-semibold">Payment Method</th>
            <th className="px-6 py-4 text-left font-semibold">Failure Reason</th>
            <th className="px-6 py-4 text-left font-semibold">Attempt</th>
            <th className="px-6 py-4 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
              <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                {item.providerTransactionRef ?? '—'}
              </td>
              <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                {item.provider}
              </td>
              <td className="px-6 py-4 font-medium" style={{ color: 'var(--text)' }}>
                {formatZar(item.amount)}
              </td>
              <td
                className="px-6 py-4 font-medium capitalize"
                style={{
                  color:
                    item.status === 'success'
                      ? 'var(--success)'
                      : item.status === 'failed'
                        ? 'var(--danger)'
                        : 'var(--warning)',
                }}
              >
                {item.status}
              </td>
              <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                {item.paymentMethod ?? '—'}
              </td>
              <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>
                {item.failureReason ?? '—'}
              </td>
              <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                #{item.attemptNumber}
              </td>
              <td className="px-6 py-4 text-right">
                {item.status === 'failed' ? (
                  <button
                    type="button"
                    onClick={() => onRetry?.(item.id)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-medium transition hover:opacity-80"
                    style={{
                      color: 'var(--text)',
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--surface-muted)',
                    }}
                  >
                    <RotateCcw size={16} />
                    Retry
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;