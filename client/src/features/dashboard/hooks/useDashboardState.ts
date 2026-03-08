import { useMemo, useState } from 'react';
import type { ChartRange, DashboardFilter } from '../types/dashboard.types';
import { recentTransactions } from '../data/dashboardMockData';

export function useDashboardState() {
  const [selectedFilter, setSelectedFilter] = useState<DashboardFilter>('failed');
  const [chartRange, setChartRange] = useState<ChartRange>('24h');
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'sales' || selectedFilter === 'settlement') {
      return recentTransactions.slice(0, 4);
    }

    if (selectedFilter === 'success') {
      return recentTransactions.filter((item) => item.status === 'success').slice(0, 4);
    }

    if (selectedFilter === 'failed') {
      return recentTransactions.filter((item) => item.status === 'failed').slice(0, 4);
    }

    if (selectedFilter === 'pending') {
      return recentTransactions.filter((item) => item.status === 'pending').slice(0, 4);
    }

    return recentTransactions.slice(0, 4);
  }, [selectedFilter]);

  return {
    selectedFilter,
    setSelectedFilter,
    chartRange,
    setChartRange,
    isAlertVisible,
    dismissAlert: () => setIsAlertVisible(false),
    filteredTransactions,
  };
}