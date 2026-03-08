export type ObservabilityRange = '1h' | '6h' | '24h' | '7d';

export type ServiceHealthStatus = 'healthy' | 'degraded';

export type ServiceHealthItem = {
  name: string;
  status: ServiceHealthStatus;
  uptime: string;
  latency: string;
};

export type TimeSeriesPoint = {
  label: string;
  p50?: number;
  p95?: number;
  p99?: number;
  value?: number;
};

export type SystemLogLevel = 'INFO' | 'WARN' | 'ERROR';

export type SystemLogItem = {
  id: string;
  timestamp: string;
  level: SystemLogLevel;
  service: string;
  message: string;
};