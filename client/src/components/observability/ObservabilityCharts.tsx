import { Activity, AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
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
import {
  apiLatencyByRange,
  duplicateEventsByRange,
  errorRateByRange,
  retryCountByRange,
} from '../../features/observability/data/observabilityMockData';
import type { ObservabilityRange } from '../../features/observability/types/observability.types';

const rangeOptions: { label: string; value: ObservabilityRange }[] = [
  { label: '1H', value: '1h' },
  { label: '6H', value: '6h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
];

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
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
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
      </div>

      <div className="h-80">{children}</div>
    </article>
  );
}

type ObservabilityChartsProps = {
  range: ObservabilityRange;
  onRangeChange: (range: ObservabilityRange) => void;
};

function ObservabilityCharts({ range, onRangeChange }: ObservabilityChartsProps) {
  const latencyData = apiLatencyByRange[range];
  const errorData = errorRateByRange[range];
  const retryData = retryCountByRange[range];
  const duplicateData = duplicateEventsByRange[range];

  return (
    <section className="space-y-6">
      <div className="flex justify-end">
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
                onClick={() => onRangeChange(option.value)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition"
                style={{
                  backgroundColor: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title={`API Latency (${range.toUpperCase()})`} icon={<Activity size={22} />}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
              <XAxis dataKey="label" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip />
              <Line type="monotone" dataKey="p50" stroke="var(--chart-success)" strokeWidth={2} />
              <Line type="monotone" dataKey="p95" stroke="var(--chart-warning)" strokeWidth={2} />
              <Line type="monotone" dataKey="p99" stroke="var(--chart-danger)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Error Rate % (${range.toUpperCase()})`} icon={<AlertCircle size={22} />}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={errorData}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
              <XAxis dataKey="label" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-danger)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--chart-danger)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Retry Count (${range.toUpperCase()})`} icon={<BarChart3 size={22} />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retryData}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
              <XAxis dataKey="label" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip />
              <Bar dataKey="value" fill="var(--chart-warning)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Duplicate Events (${range.toUpperCase()})`} icon={<TrendingUp size={22} />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={duplicateData}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
              <XAxis dataKey="label" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </section>
  );
}

export default ObservabilityCharts;