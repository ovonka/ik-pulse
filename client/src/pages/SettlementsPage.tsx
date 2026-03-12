import { useState } from 'react';
import { BadgeDollarSign, Clock3, CalendarDays, Wallet } from 'lucide-react';
import SettlementMetricCard from '../components/settlements/SettlementMetricCard';
import NextSettlementCard from '../components/settlements/NextSettlementCard';
import SettlementHistoryTable from '../components/settlements/SettlementHistoryTable';
import { usePollingQuery } from '../features/merchant-ops/hooks/usePollingQuery';
import {
  getSettlementsRequest,
  getSettlementSummaryRequest,
} from '../features/merchant-ops/api/settlementsApi';
import { formatZar } from '../features/merchant-ops/utils/formatCurrency';

function formatAverageSettlementTime() {
  return 'T+1 day';
}

function formatSettlementAccuracy() {
  return '99.8%';
}

function SettlementsPage() {
  const [page] = useState(1);

  const { data: settlementsData } = usePollingQuery({
    queryFn: () =>
      getSettlementsRequest({
        page,
        pageSize: 10,
      }),
    intervalMs: 15000,
  });

  const { data: settlementSummary } = usePollingQuery({
    queryFn: getSettlementSummaryRequest,
    intervalMs: 15000,
  });

  const settlements = settlementsData?.items ?? [];
  const nextSettlement =
    settlements.find((item) => item.status === 'pending' || item.status === 'delayed') ?? null;

  return (
    <section className="space-y-6">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SettlementMetricCard
          title="Total Settled"
          value={formatZar(settlementSummary?.totalSettledAmount ?? 0)}
          icon={BadgeDollarSign}
          iconColor="var(--success)"
          iconBg="var(--success-soft)"
        />

        <SettlementMetricCard
          title="Pending Settlement"
          value={formatZar(settlementSummary?.pendingSettlementAmount ?? 0)}
          icon={Wallet}
          iconColor="var(--warning)"
          iconBg="var(--warning-soft)"
        />

        <SettlementMetricCard
          title="Avg Settlement Time"
          value={formatAverageSettlementTime()}
          icon={Clock3}
        />

        <SettlementMetricCard
          title="Settlement Accuracy"
          value={formatSettlementAccuracy()}
          icon={CalendarDays}
          iconColor="var(--success)"
          iconBg="var(--success-soft)"
        />
      </section>

      <NextSettlementCard settlement={nextSettlement} />

      <SettlementHistoryTable items={settlements} />
    </section>
  );
}

export default SettlementsPage;