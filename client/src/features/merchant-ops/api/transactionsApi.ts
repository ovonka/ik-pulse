import { apiGet, apiPost } from './apiClient';
import type {
  RetryTransactionResponse,
  TransactionSummaryResponse,
  TransactionsListResponse,
} from '../types/merchantOps.types';
import { getScopedMerchantId } from '../utils/getScopedMerchandId';

type GetTransactionsParams = {
  page?: number;
  pageSize?: number;
  status?: 'success' | 'failed' | 'pending';
  search?: string;
};

function toQueryString(params: GetTransactionsParams) {
  const query = new URLSearchParams();
  const merchantId = getScopedMerchantId();

  if (merchantId) query.set('merchantId', merchantId);
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
  const merchantId = getScopedMerchantId();
  const query = merchantId ? `?merchantId=${encodeURIComponent(merchantId)}` : '';

  return apiGet<TransactionSummaryResponse>(`/transactions/summary${query}`);
}

export function retryTransactionRequest(transactionId: string) {
  const merchantId = getScopedMerchantId();

  return apiPost<RetryTransactionResponse>(`/transactions/${transactionId}/retry`, {
    merchantId,
  });
}