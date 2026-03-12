import { apiGet } from './apiClient';
import type { DashboardOverviewResponse } from '../types/merchantOps.types';
import { getScopedMerchantId } from '../utils/getScopedMerchandId';

export function getDashboardOverviewRequest() {
  const merchantId = getScopedMerchantId();
  const query = merchantId ? `?merchantId=${encodeURIComponent(merchantId)}` : '';

  return apiGet<DashboardOverviewResponse>(`/dashboard/overview${query}`);
}