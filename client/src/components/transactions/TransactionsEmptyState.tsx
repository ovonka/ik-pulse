import { Search } from 'lucide-react';

function TransactionsEmptyState() {
  return (
    <section
      className="flex min-h-80 flex-col items-center justify-center border px-6 py-12 text-center"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--surface-muted)' }}
      >
        <Search size={32} style={{ color: 'var(--text-muted)' }} />
      </div>

      <h2 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
        No transactions found
      </h2>

      <p className="mt-4 max-w-md text-base" style={{ color: 'var(--text-muted)' }}>
        Try adjusting your search or filter criteria
      </p>
    </section>
  );
}

export default TransactionsEmptyState;