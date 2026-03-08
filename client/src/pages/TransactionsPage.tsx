import TransactionFilterBar from '../components/transactions/TransactionFilterBar';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionPagination from '../components/transactions/TransactionPagination';
import TransactionsEmptyState from '../components/transactions/TransactionsEmptyState';
import { useTransactionsState } from '../features/transactions/hooks/useTransactionState';

function TransactionsPage() {
  const {
    search,
    statusFilter,
    currentPage,
    totalPages,
    totalCount,
    transactions,
    setCurrentPage,
    updateSearch,
    updateStatusFilter,
  } = useTransactionsState();

  const hasResults = totalCount > 0;

  return (
    <section className="space-y-6">
      <TransactionFilterBar
        search={search}
        statusFilter={statusFilter}
        onSearchChange={updateSearch}
        onStatusFilterChange={updateStatusFilter}
      />

      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing {totalCount} of {totalCount} transactions
      </p>

      {hasResults ? (
        <div
          className="overflow-hidden border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <TransactionTable items={transactions} />
          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(Math.max(1, currentPage - 1))}
            onNext={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          />
        </div>
      ) : (
        <TransactionsEmptyState />
      )}
    </section>
  );
}

export default TransactionsPage;