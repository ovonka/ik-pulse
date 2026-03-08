import { BadgeDollarSign, Clock3, CalendarDays, Wallet } from 'lucide-react';
import SettlementMetricCard from '../components/settlements/SettlementMetricCard';
import NextSettlementCard from '../components/settlements/NextSettlementCard';
import SettlementHistoryTable from '../components/settlements/SettlementHistoryTable';
import {
  nextSettlement,
  settlementHistory,
  settlementMetrics,
} from '../features/settlements/data/settlementsMockData';

function SettlementsPage() {
  return (
    <section className="space-y-6">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SettlementMetricCard
          title="Total Settled (Last 7d)"
          value={`R${settlementMetrics.totalSettledLast7d.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={BadgeDollarSign}
          iconColor="var(--success)"
          iconBg="var(--success-soft)"
        />

        <SettlementMetricCard
          title="Pending Settlement"
          value={`R${settlementMetrics.pendingSettlement.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={Wallet}
          iconColor="var(--warning)"
          iconBg="var(--warning-soft)"
        />

        <SettlementMetricCard
          title="Avg Settlement Time"
          value={settlementMetrics.averageSettlementTime}
          icon={Clock3}
        />

        <SettlementMetricCard
          title="Settlement Accuracy"
          value={settlementMetrics.settlementAccuracy}
          icon={CalendarDays}
          iconColor="var(--success)"
          iconBg="var(--success-soft)"
        />
      </section>

      <NextSettlementCard settlement={nextSettlement} />

      <SettlementHistoryTable items={settlementHistory} />
    </section>
  );
}

export default SettlementsPage;