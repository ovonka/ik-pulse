import { Eye, RotateCcw, Search } from 'lucide-react';

type RecentTransaction = {
  id: string;
  rawId: string;
  merchant: string;
  amount: number;
  paymentMethod: string | null;
  timestamp: string;
  reason: string | null;
  status: 'success' | 'failed' | 'pending';
};

type RecentTransactionsTableProps = {
  title: string;
  items: RecentTransaction[];
  onRetry?: (transactionId: string) => void;
};

function getActionConfig(item: RecentTransaction) {
  if (item.status === 'failed') {
    return {
      label: 'Retry',
      icon: RotateCcw,
    };
  }

  if (item.status === 'pending') {
    return {
      label: 'Review',
      icon: Search,
    };
  }

  return {
    label: 'View',
    icon: Eye,
  };
}

function RecentTransactionsTable({
  title,
  items,
  onRetry,
}: RecentTransactionsTableProps) {
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
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--text-secondary)' }}>
              <th className="px-6 py-4 text-left font-semibold">Transaction ID</th>
              <th className="px-6 py-4 text-left font-semibold">Merchant</th>
              <th className="px-6 py-4 text-left font-semibold">Amount</th>
              <th className="px-6 py-4 text-left font-semibold">Payment Method</th>
              <th className="px-6 py-4 text-left font-semibold">Timestamp</th>
              <th className="px-6 py-4 text-left font-semibold">Reason</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const action = getActionConfig(item);
              const ActionIcon = action.icon;

              return (
                <tr key={item.rawId} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                    {item.id}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                    {item.merchant}
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: 'var(--text)' }}>
                    R{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text)' }}>
                    {item.paymentMethod ?? '—'}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>
                    {item.timestamp}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      color: item.status === 'failed' ? 'var(--danger)' : 'var(--text-secondary)',
                    }}
                  >
                    {item.reason ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-medium transition hover:opacity-80"
                        style={{
                          color: 'var(--text)',
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--surface-muted)',
                        }}
                        onClick={() => {
                          if (item.status === 'failed' && onRetry) {
                            onRetry(item.rawId);
                          }
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

export default RecentTransactionsTable;