import { useMemo, useState } from 'react';
import { transactionsMockData } from '../data/transactionsMockData';
import type { TransactionFilter } from '../types/transactions.types';

export function useTransactionsState() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactionsMockData.filter((transaction) => {
      const matchesStatus =
        statusFilter === 'all' ? true : transaction.status === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        transaction.id.toLowerCase().includes(query) ||
        transaction.merchant.toLowerCase().includes(query) ||
        transaction.idempotencyKey.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage]);

  const updateSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateStatusFilter = (value: TransactionFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return {
    search,
    statusFilter,
    currentPage,
    pageSize,
    totalPages,
    totalCount: filteredTransactions.length,
    transactions: paginatedTransactions,
    setCurrentPage,
    updateSearch,
    updateStatusFilter,
  };
}