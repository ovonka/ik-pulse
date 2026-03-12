import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Wallet,
  XCircle,
  BadgeDollarSign,
} from 'lucide-react';
import AlertBanner from '../components/dashboard/AlertBanner';
import MetricCard from '../components/dashboard/MetricCard';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RecentTransactionsTable from '../components/dashboard/RecentTransactionsTable';
import { usePollingQuery } from '../features/merchant-ops/hooks/usePollingQuery';
import { getDashboardOverviewRequest } from '../features/merchant-ops/api/dashboardApi';
import {
  getTransactionsRequest,
  retryTransactionRequest,
} from '../features/merchant-ops/api/transactionsApi';
import { formatZar } from '../features/merchant-ops/utils/formatCurrency';
import { useToastStore } from '../app/store/toastStore';

type SelectedFilter = 'sales' | 'success' | 'failed' | 'pending' | 'settlement';
type ChartRange = '1d' | '3d' | '7d' | '14d' | '30d';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>('failed');
  const [chartRange, setChartRange] = useState<ChartRange>('7d');
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const showToast = useToastStore((state) => state.showToast);

  const { data: dashboardData, refetch: refetchDashboard } = usePollingQuery({
    queryFn: getDashboardOverviewRequest,
    intervalMs: 15000,
  });

  const transactionStatusFilter =
    selectedFilter === 'success'
      ? 'success'
      : selectedFilter === 'failed'
        ? 'failed'
        : selectedFilter === 'pending'
          ? 'pending'
          : undefined;

  const { data: tableTransactionsData, refetch: refetchTableTransactions } = usePollingQuery({
    queryFn: () =>
      getTransactionsRequest({
        page: 1,
        pageSize: 4,
        status: transactionStatusFilter,
      }),
    intervalMs: 10000,
    deps: [selectedFilter],
  });

  const metrics = dashboardData?.metrics;
  const breakdown = dashboardData?.statusBreakdown ?? {
    success: 0,
    failed: 0,
    pending: 0,
  };
  const volumeSeries = dashboardData?.volumeSeries ?? [];

  const tableTitleMap: Record<SelectedFilter, string> = {
    sales: 'Recent Transactions',
    success: 'Recent Successful Transactions',
    failed: 'Recent Failed Transactions',
    pending: 'Recent Pending Transactions',
    settlement: 'Recent Transactions',
  };

  const filteredTransactions = useMemo(() => {
    const items = tableTransactionsData?.items ?? [];

    return items.map((item) => ({
      id: item.providerTransactionRef ?? item.id.slice(0, 8),
      rawId: item.id,
      merchant: 'Current Merchant',
      amount: item.amount,
      paymentMethod: item.paymentMethod,
      timestamp: formatDateTime(item.createdAt),
      reason: item.failureReason,
      status: item.status,
    }));
  }, [tableTransactionsData]);

  async function handleRetry(transactionId: string) {
    try {
      const result = await retryTransactionRequest(transactionId);

      showToast({
        type: result.outcome === 'success' ? 'success' : 'warning',
        title: result.outcome === 'success' ? 'Retry succeeded' : 'Retry failed again',
        message: result.message,
      });

      await Promise.all([refetchDashboard(), refetchTableTransactions()]);
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
      {isAlertVisible && breakdown.failed > 0 && (
        <AlertBanner
          title="Failed Transactions Detected"
          message="There are recent failed payments that may need review or retry."
          onDismiss={() => setIsAlertVisible(false)}
        />
      )}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total Sales"
          value={formatZar(metrics?.totalSales ?? 0)}
          trend={metrics ? `${metrics.successfulTransactions} successful payments` : undefined}
          trendType="positive"
          icon={BadgeDollarSign}
          isActive={selectedFilter === 'sales'}
          onClick={() => setSelectedFilter('sales')}
        />

        <MetricCard
          title="Successful Transactions"
          value={metrics?.successfulTransactions ?? 0}
          trend={`${breakdown.success} in current period`}
          trendType="positive"
          icon={CheckCircle2}
          isActive={selectedFilter === 'success'}
          onClick={() => setSelectedFilter('success')}
        />

        <MetricCard
          title="Failed Transactions"
          value={metrics?.failedTransactions ?? 0}
          trend={`${breakdown.failed} currently failed`}
          trendType="negative"
          icon={XCircle}
          isActive={selectedFilter === 'failed'}
          onClick={() => setSelectedFilter('failed')}
        />

        <MetricCard
          title="Pending Transactions"
          value={metrics?.pendingTransactions ?? 0}
          subtitle="Awaiting final status"
          icon={Clock3}
          isActive={selectedFilter === 'pending'}
          onClick={() => setSelectedFilter('pending')}
        />

        <MetricCard
          title="Next Settlement"
          value={formatZar(metrics?.nextSettlement?.netAmount ?? 0)}
          subtitle={
            metrics?.nextSettlement
              ? `Expected: ${formatDateTime(metrics.nextSettlement.scheduledFor)}`
              : 'No pending settlement'
          }
          icon={Wallet}
          isActive={selectedFilter === 'settlement'}
          onClick={() => setSelectedFilter('settlement')}
        />
      </section>

      <DashboardCharts
        chartRange={chartRange}
        onChartRangeChange={setChartRange}
        volumeSeries={volumeSeries}
        statusBreakdown={breakdown}
      />

      <RecentTransactionsTable
        title={tableTitleMap[selectedFilter]}
        items={filteredTransactions}
        onRetry={(rawId) => handleRetry(rawId)}
      />
    </section>
  );
}

export default DashboardPage;