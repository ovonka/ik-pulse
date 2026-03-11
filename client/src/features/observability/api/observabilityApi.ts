import { apiGet } from '../../merchant-ops/api/apiClient';
import { getScopedMerchantId } from '../../merchant-ops/utils/getScopedMerchandId';
import type { ObservabilityOverviewResponse } from '../types/observability.types';

export function getObservabilityOverviewRequest(range: '1h' | '24h' | '7d' | '30d') {
  const query = new URLSearchParams();
  const merchantId = getScopedMerchantId();

  query.set('range', range);

  if (merchantId) {
    query.set('merchantId', merchantId);
  }

  return apiGet<ObservabilityOverviewResponse>(`/observability/overview?${query.toString()}`);
}