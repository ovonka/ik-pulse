import { CheckCircle2, Clock3, Wallet, XCircle, BadgeDollarSign } from 'lucide-react';
import AlertBanner from '../components/dashboard/AlertBanner';
import MetricCard from '../components/dashboard/MetricCard';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RecentTransactionsTable from '../components/dashboard/RecentTransactionsTable';
import { dashboardSummary } from '../features/dashboard/data/dashboardMockData';
import { useDashboardState } from '../features/dashboard/hooks/useDashboardState';

function DashboardPage() {
  const {
    selectedFilter,
    setSelectedFilter,
    chartRange,
    setChartRange,
    isAlertVisible,
    dismissAlert,
    filteredTransactions,
  } = useDashboardState();

  const tableTitleMap = {
    sales: 'Recent Transactions',
    success: 'Recent Successful Transactions',
    failed: 'Recent Failed Transactions',
    pending: 'Recent Pending Transactions',
    settlement: 'Recent Settlement-Related Transactions',
  };

  return (
    <section className="space-y-6">
      {isAlertVisible && (
        <AlertBanner
          title="High Failure Rate Detected"
          message="Transaction failure rate is above 2.5% in the last hour. Review failed transactions for patterns."
          onDismiss={dismissAlert}
        />
      )}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total Sales Today"
          value={`R${dashboardSummary.totalSalesToday.toLocaleString()}`}
          trend={`↑ ${dashboardSummary.salesGrowth}% from yesterday`}
          trendType="positive"
          icon={BadgeDollarSign}
          isActive={selectedFilter === 'sales'}
          onClick={() => setSelectedFilter('sales')}
        />

        <MetricCard
          title="Successful Transactions"
          value={dashboardSummary.successfulTransactions}
          trend={`↑ ${dashboardSummary.successGrowth}% from yesterday`}
          trendType="positive"
          icon={CheckCircle2}
          isActive={selectedFilter === 'success'}
          onClick={() => setSelectedFilter('success')}
        />

        <MetricCard
          title="Failed Transactions"
          value={dashboardSummary.failedTransactions}
          trend={`↓ ${dashboardSummary.failedDelta} more than yesterday`}
          trendType="negative"
          icon={XCircle}
          isActive={selectedFilter === 'failed'}
          onClick={() => setSelectedFilter('failed')}
        />

        <MetricCard
          title="Pending Transactions"
          value={dashboardSummary.pendingTransactions}
          icon={Clock3}
          isActive={selectedFilter === 'pending'}
          onClick={() => setSelectedFilter('pending')}
        />

        <MetricCard
          title="Next Settlement"
          value={`R${dashboardSummary.nextSettlement.toLocaleString()}`}
          subtitle={`Expected: ${dashboardSummary.nextSettlementDate}`}
          icon={Wallet}
          isActive={selectedFilter === 'settlement'}
          onClick={() => setSelectedFilter('settlement')}
        />
      </section>

      <DashboardCharts chartRange={chartRange} onChartRangeChange={setChartRange} />

      <RecentTransactionsTable
        title={tableTitleMap[selectedFilter]}
        items={filteredTransactions}
      />
    </section>
  );
}

export default DashboardPage;