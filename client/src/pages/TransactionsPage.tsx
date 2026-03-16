import { useCallback, useEffect, useRef, useState } from 'react';
import TransactionFilterBar from '../components/transactions/TransactionFilterBar';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionPagination from '../components/transactions/TransactionPagination';
import TransactionsEmptyState from '../components/transactions/TransactionsEmptyState';
import {
  getTransactionsRequest,
  retryTransactionRequest,
} from '../features/merchant-ops/api/transactionsApi';
import { useToastStore } from '../app/store/toastStore';

type TransactionsResponse = Awaited<ReturnType<typeof getTransactionsRequest>>;

function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'success' | 'failed' | 'pending' | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const [transactionsData, setTransactionsData] = useState<TransactionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);

  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const fetchTransactions = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!hasLoadedRef.current) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const result = await getTransactionsRequest({
        page: currentPage,
        pageSize: 10,
        status: statusFilter,
        search: debouncedSearch.trim() || undefined,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setTransactionsData(result);
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [currentPage, statusFilter, debouncedSearch]);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const transactions = transactionsData?.items ?? [];
  const pagination = transactionsData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const hasResults = transactions.length > 0;

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

      await fetchTransactions();
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

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Showing {transactions.length} recent transaction{transactions.length === 1 ? '' : 's'}
          {totalPages > 1 ? ` • Page ${currentPage} of ${totalPages}` : ''}
        </p>

        {isRefreshing ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Updating…
          </p>
        ) : null}
      </div>

      {isLoading && !transactionsData ? (
        <TransactionsEmptyState />
      ) : hasResults ? (
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
            onPrevious={() => {
              if (isRefreshing) return;
              setCurrentPage((page) => Math.max(1, page - 1));
            }}
            onNext={() => {
              if (isRefreshing) return;
              setCurrentPage((page) => Math.min(totalPages, page + 1));
            }}
          />
        </div>
      ) : (
        <TransactionsEmptyState />
      )}
    </section>
  );
}

export default TransactionsPage;