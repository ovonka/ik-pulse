import { apiGet, apiPost } from './apiClient';
import type {
  RetryTransactionResponse,
  TransactionSummaryResponse,
  TransactionsListResponse,
} from '../types/merchantOps.types';

type GetTransactionsParams = {
  page?: number;
  pageSize?: number;
  status?: 'success' | 'failed' | 'pending';
  search?: string;
};

function toQueryString(params: GetTransactionsParams) {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export function getTransactionsRequest(params: GetTransactionsParams = {}) {
  return apiGet<TransactionsListResponse>(`/transactions${toQueryString(params)}`);
}

export function getTransactionSummaryRequest() {
  return apiGet<TransactionSummaryResponse>('/transactions/summary');
}

export function retryTransactionRequest(transactionId: string) {
  return apiPost<RetryTransactionResponse>(`/transactions/${transactionId}/retry`);
}