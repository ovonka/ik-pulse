import { Eye, RotateCcw, Search } from 'lucide-react';
import type { TransactionItem } from '../../features/transactions/types/transactions.types';
import TransactionStatusBadge from './TransactionStatusBadge';
import { useToastStore } from '../../app/store/toastStore';

type TransactionTableProps = {
  items: TransactionItem[];
};

function getActionConfig(status: TransactionItem['status']) {
  if (status === 'failed') {
    return { label: 'Retry', icon: RotateCcw };
  }

  if (status === 'pending') {
    return { label: 'Review', icon: Search };
  }

  return { label: 'View', icon: Eye };
}

function TransactionTable({ items }: TransactionTableProps) {
  const showToast = useToastStore((state) => state.showToast);

  const handleActionClick = (item: TransactionItem) => {
    if (item.status === 'failed') {
      showToast({
        type: 'info',
        title: `Retrying transaction ${item.id}`,
        message: 'Processing payment retry...',
      });
      return;
    }

    if (item.status === 'pending') {
      showToast({
        type: 'warning',
        title: `Reviewing transaction ${item.id}`,
        message: 'Pending transaction flagged for review.',
      });
      return;
    }

    showToast({
      type: 'success',
      title: `Viewing transaction ${item.id}`,
      message: 'Opening transaction details...',
    });
  };

  return (
    <section
      className="overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--text-secondary)' }}>
              <th className="px-4 py-4 text-left font-semibold">Transaction ID</th>
              <th className="px-4 py-4 text-left font-semibold">Merchant</th>
              <th className="px-4 py-4 text-left font-semibold">Amount</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Payment Method</th>
              <th className="px-4 py-4 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-4 text-left font-semibold">Idempotency Key</th>
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const action = getActionConfig(item.status);
              const ActionIcon = action.icon;

              return (
                <tr
                  key={item.id}
                  className="border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-4 py-4" style={{ color: 'var(--text)' }}>
                    {item.id}
                  </td>
                  <td className="px-4 py-4" style={{ color: 'var(--text)' }}>
                    {item.merchant}
                  </td>
                  <td className="px-4 py-4 font-medium" style={{ color: 'var(--text)' }}>
                    R{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4">
                    <TransactionStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-4" style={{ color: 'var(--text)' }}>
                    {item.paymentMethod}
                  </td>
                  <td className="px-4 py-4" style={{ color: 'var(--text-muted)' }}>
                    {item.timestamp}
                  </td>
                  <td
                    className="px-4 py-4 font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.idempotencyKey}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleActionClick(item)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-medium transition hover:opacity-80"
                        style={{
                          color: 'var(--text)',
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--surface-muted)',
                        }}
                      >
                        <ActionIcon size={16} />
                        {action.label}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TransactionTable;