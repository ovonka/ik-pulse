export type ObservabilityRange = '1h' | '6h' | '24h' | '7d';

export type ServiceHealthStatus = 'healthy' | 'degraded';

export type ServiceHealthItem = {
  name: string;
  status: ServiceHealthStatus;
  uptime: string;
  latency: string;
};

export type SystemLogItem = {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
};

export type ObservabilityChartPoint = {
  label: string;
  value: number;
};

export type ObservabilityLatencyPoint = {
  label: string;
  p50: number;
  p95: number;
  p99: number;
};

export type ProviderBreakdownChartPoint = {
  provider: string;
  successCount: number;
  failedCount: number;
  pendingCount: number;
};

export type FailureReasonChartPoint = {
  reason: string;
  count: number;
};

export type ObservabilityChartsData = {
  apiLatency: ObservabilityLatencyPoint[];
  errorRate: ObservabilityChartPoint[];
  retryCount: ObservabilityChartPoint[];
  duplicateEvents: ObservabilityChartPoint[];
  providerBreakdown: ProviderBreakdownChartPoint[];
  failureReasons: FailureReasonChartPoint[];
};