import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  transactionVolumeByRange,
  statusBreakdownByRange,
} from '../../features/dashboard/data/dashboardMockData';
import type { ChartRange } from '../../features/dashboard/types/dashboard.types';

const pieColors = ['var(--chart-success)', 'var(--chart-danger)', 'var(--chart-warning)'];

type DashboardChartsProps = {
  chartRange: ChartRange;
  onChartRangeChange: (range: ChartRange) => void;
};

const rangeOptions: { label: string; value: ChartRange }[] = [
  { label: '24H', value: '24h' },
  { label: '3D', value: '3d' },
  { label: '7D', value: '7d' },
  { label: '14D', value: '14d' },
  { label: '30D', value: '30d' },
];

function DashboardCharts({ chartRange, onChartRangeChange }: DashboardChartsProps) {
  const chartData = transactionVolumeByRange[chartRange];
  const pieData = statusBreakdownByRange[chartRange];

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
      <article
        className="border p-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Transaction Volume
          </h2>

          <div
            className="inline-flex rounded-xl border p-1"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface-muted)',
            }}
          >
            {rangeOptions.map((option) => {
              const active = chartRange === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition"
                  style={{
                    backgroundColor: active ? 'var(--surface)' : 'transparent',
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                  }}
                  onClick={() => onChartRangeChange(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-90">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
              <XAxis dataKey="label" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-primary)"
                strokeWidth={3}
                dot={{ r: 5, fill: 'var(--chart-primary)' }}
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
        <h2 className="mb-6 text-xl font-semibold" style={{ color: 'var(--text)' }}>
          Status Breakdown
        </h2>

        <div className="h-90">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-3">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
              </div>
              <span className="font-medium" style={{ color: 'var(--text)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default DashboardCharts;