import { Search } from 'lucide-react';
import type { TransactionFilter } from '../../features/transactions/types/transactions.types';

type TransactionFilterBarProps = {
  search: string;
  statusFilter: TransactionFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TransactionFilter) => void;
};

const filterOptions: { label: string; value: TransactionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Success', value: 'success' },
  { label: 'Failed', value: 'failed' },
  { label: 'Pending', value: 'pending' },
];

function TransactionFilterBar({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: TransactionFilterBarProps) {
  return (
    <section
      className="border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-4xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by transaction ID, merchant, or idempotency key..."
            className="w-full border py-3 pl-11 pr-4 outline-none"
            style={{
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--text)',
              borderColor: 'transparent',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        <div
          className="inline-flex rounded-xl border p-1"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface-muted)',
          }}
        >
          {filterOptions.map((option) => {
            const active = statusFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onStatusFilterChange(option.value)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition"
                style={{
                  backgroundColor: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TransactionFilterBar;