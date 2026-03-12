import { useState } from 'react';
import TransactionFilterBar from '../components/transactions/TransactionFilterBar';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionPagination from '../components/transactions/TransactionPagination';
import TransactionsEmptyState from '../components/transactions/TransactionsEmptyState';
import { usePollingQuery } from '../features/merchant-ops/hooks/usePollingQuery';
import {
  getTransactionsRequest,
  retryTransactionRequest,
} from '../features/merchant-ops/api/transactionsApi';
import { useToastStore } from '../app/store/toastStore';

function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'success' | 'failed' | 'pending' | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = useToastStore((state) => state.showToast);

  const { data: transactionsData, refetch } = usePollingQuery({
    queryFn: () =>
      getTransactionsRequest({
        page: currentPage,
        pageSize: 10,
        status: statusFilter,
        search: search.trim() || undefined,
      }),
    intervalMs: 10000,
    deps: [currentPage, statusFilter, search],
  });

  const transactions = transactionsData?.items ?? [];
  const pagination = transactionsData?.pagination;
  const totalCount = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const hasResults = totalCount > 0;

  function updateSearch(value: string) {
    setCurrentPage(1);
    setSearch(value);
  }

  function updateStatusFilter(value: 'all' | 'success' | 'failed' | 'pending') {
    setCurrentPage(1);
    setStatusFilter(value === 'all' ? undefined : value);
  }

  async function handleRetry(transactionId: string) {
    try {
      const result = await retryTransactionRequest(transactionId);

      showToast({
        type: result.outcome === 'success' ? 'success' : 'warning',
        title: result.outcome === 'success' ? 'Retry succeeded' : 'Retry failed again',
        message: result.message,
      });

      await refetch();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Retry failed',
        message: error instanceof Error ? error.message : 'Retry request failed',
      });
    }
  }

  return (
    <section className="space-y-6">
      <TransactionFilterBar
        search={search}
        statusFilter={statusFilter ?? 'all'}
        onSearchChange={updateSearch}
        onStatusFilterChange={updateStatusFilter}
      />

      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing {transactions.length} of {totalCount} transactions
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
          <TransactionTable items={transactions} onRetry={handleRetry} />
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