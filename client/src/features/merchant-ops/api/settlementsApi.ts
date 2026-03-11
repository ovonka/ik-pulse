import { apiGet } from './apiClient';
import type {
  SettlementSummaryResponse,
  SettlementsListResponse,
} from '../types/merchantOps.types';

type GetSettlementsParams = {
  page?: number;
  pageSize?: number;
  status?: 'pending' | 'completed' | 'delayed';
  search?: string;
};

function toQueryString(params: GetSettlementsParams) {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export function getSettlementsRequest(params: GetSettlementsParams = {}) {
  return apiGet<SettlementsListResponse>(`/settlements${toQueryString(params)}`);
}

export function getSettlementSummaryRequest() {
  return apiGet<SettlementSummaryResponse>('/settlements/summary');
}