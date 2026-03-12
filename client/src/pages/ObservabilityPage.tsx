import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { usePollingQuery } from '../features/merchant-ops/hooks/usePollingQuery';
import { getObservabilityOverviewRequest } from '../features/observability/api/observabilityApi';

type RangeOption = '1h' | '24h' | '7d' | '30d';

const rangeOptions: { label: string; value: RangeOption }[] = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
];

function ObservabilityMetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: typeof Activity;
}) {
  return (
    <article
      className="border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </p>
        <Icon size={20} style={{ color: 'var(--text-secondary)' }} />
      </div>

      <h3 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
        {value}
      </h3>
    </article>
  );
}

function ObservabilityPage() {
  const [range, setRange] = useState<RangeOption>('24h');

  const { data } = usePollingQuery({
    queryFn: () => getObservabilityOverviewRequest(range),
    intervalMs: 15000,
    deps: [range],
  });

  const metrics = data?.metrics;
  const timeSeries = data?.timeSeries ?? [];
  const failureReasons = data?.failureReasons ?? [];
  const providerBreakdown = data?.providerBreakdown ?? [];
  const recentEvents = data?.recentEvents ?? [];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
          Observability
        </h2>

        <div
          className="inline-flex rounded-xl border p-1"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface-muted)',
          }}
        >
          {rangeOptions.map((option) => {
            const active = range === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition"
                style={{
                  backgroundColor: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ObservabilityMetricCard
          title="Total Transactions"
          value={metrics?.totalTransactions ?? 0}
          icon={Activity}
        />
        <ObservabilityMetricCard
          title="Failed Transactions"
          value={metrics?.failedTransactions ?? 0}
          icon={AlertTriangle}
        />
        <ObservabilityMetricCard
          title="Success Rate"
          value={`${metrics?.successRate ?? 0}%`}
          icon={CheckCircle2}
        />
        <ObservabilityMetricCard
          title="Avg End-to-End Latency"
          value={`${metrics?.avgEndToEndLatencyMs ?? 0} ms`}
          icon={Clock3}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article
          className="border p-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="mb-6 text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Transaction Status Trend
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
                <XAxis dataKey="label" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="successCount"
                  stroke="var(--chart-success)"
                  strokeWidth={3}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="failedCount"
                  stroke="var(--chart-danger)"
                  strokeWidth={3}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="pendingCount"
                  stroke="var(--chart-warning)"
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article
          className="border p-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="mb-6 text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Provider Breakdown
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerBreakdown}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
                <XAxis dataKey="provider" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="successCount" fill="var(--chart-success)" isAnimationActive={false} />
                <Bar dataKey="failedCount" fill="var(--chart-danger)" isAnimationActive={false} />
                <Bar dataKey="pendingCount" fill="var(--chart-warning)" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_2fr]">
        <article
          className="border p-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="mb-6 text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Failure Reasons
          </h3>

          <div className="space-y-4">
            {failureReasons.length > 0 ? (
              failureReasons.map((item) => (
                <div key={item.reason} className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>{item.reason}</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No failure reasons in this range.</p>
            )}
          </div>
        </article>

        <article
          className="border p-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="mb-6 text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Recent Events
          </h3>

          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border px-4 py-3"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--surface-muted)',
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text)' }}>
                        {event.type.replaceAll('_', ' ')}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {event.provider} • {event.providerTransactionRef ?? event.id.slice(0, 8)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium capitalize" style={{ color: 'var(--text)' }}>
                        {event.status}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Attempt #{event.attemptNumber}
                      </p>
                    </div>
                  </div>

                  {event.failureReason ? (
                    <p className="mt-2 text-sm" style={{ color: 'var(--danger)' }}>
                      {event.failureReason}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No recent events in this range.</p>
            )}
          </div>
        </article>
      </section>
    </section>
  );
}

export default ObservabilityPage;