import { apiGet } from './apiClient';
import type { DashboardOverviewResponse } from '../types/merchantOps.types';

export function getDashboardOverviewRequest() {
  return apiGet<DashboardOverviewResponse>('/dashboard/overview');
}