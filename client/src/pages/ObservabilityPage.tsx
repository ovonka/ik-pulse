import ServiceHealthCard from '../components/observability/ServiceHealthCard';
import ObservabilityCharts from '../components/observability/ObservabilityCharts';
import SystemLogsTable from '../components/observability/SystemLogsTable';
import {
  recentSystemLogs,
  serviceHealthItems,
} from '../features/observability/data/observabilityMockData';
import { useObservabilityState } from '../features/observability/hooks/useObservabilityState';

function ObservabilityPage() {
  const { range, setRange } = useObservabilityState();

  return (
    <section className="space-y-6">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {serviceHealthItems.map((item) => (
          <ServiceHealthCard key={item.name} item={item} />
        ))}
      </section>

      <ObservabilityCharts range={range} onRangeChange={setRange} />

      <SystemLogsTable items={recentSystemLogs} />
    </section>
  );
}

export default ObservabilityPage;