import type {
  ObservabilityRange,
  ServiceHealthItem,
  SystemLogItem,
  TimeSeriesPoint,
} from '../types/observability.types';

export const serviceHealthItems: ServiceHealthItem[] = [
  {
    name: 'Payment API',
    status: 'healthy',
    uptime: '99.99%',
    latency: '45ms',
  },
  {
    name: 'Webhook Service',
    status: 'healthy',
    uptime: '99.95%',
    latency: '32ms',
  },
  {
    name: 'Settlement Service',
    status: 'degraded',
    uptime: '98.50%',
    latency: '156ms',
  },
  {
    name: 'Auth Service',
    status: 'healthy',
    uptime: '100%',
    latency: '12ms',
  },
];

export const apiLatencyByRange: Record<ObservabilityRange, TimeSeriesPoint[]> = {
  '1h': [
    { label: '00m', p50: 26, p95: 39, p99: 48 },
    { label: '10m', p50: 28, p95: 42, p99: 51 },
    { label: '20m', p50: 31, p95: 45, p99: 55 },
    { label: '30m', p50: 29, p95: 43, p99: 52 },
    { label: '40m', p50: 33, p95: 47, p99: 57 },
    { label: '50m', p50: 30, p95: 44, p99: 53 },
    { label: '60m', p50: 27, p95: 40, p99: 49 },
  ],
  '6h': [
    { label: '00:00', p50: 24, p95: 38, p99: 45 },
    { label: '01:00', p50: 23, p95: 36, p99: 43 },
    { label: '02:00', p50: 26, p95: 40, p99: 47 },
    { label: '03:00', p50: 28, p95: 42, p99: 49 },
    { label: '04:00', p50: 30, p95: 44, p99: 52 },
    { label: '05:00', p50: 27, p95: 41, p99: 48 },
    { label: '06:00', p50: 25, p95: 39, p99: 46 },
  ],
  '24h': [
    { label: '00:00', p50: 24, p95: 38, p99: 45 },
    { label: '04:00', p50: 22, p95: 35, p99: 42 },
    { label: '08:00', p50: 28, p95: 41, p99: 48 },
    { label: '12:00', p50: 32, p95: 44, p99: 51 },
    { label: '16:00', p50: 35, p95: 47, p99: 54 },
    { label: '20:00', p50: 29, p95: 42, p99: 49 },
    { label: '23:59', p50: 26, p95: 39, p99: 46 },
  ],
  '7d': [
    { label: 'Mon', p50: 25, p95: 40, p99: 48 },
    { label: 'Tue', p50: 27, p95: 42, p99: 50 },
    { label: 'Wed', p50: 29, p95: 44, p99: 53 },
    { label: 'Thu', p50: 31, p95: 46, p99: 55 },
    { label: 'Fri', p50: 34, p95: 49, p99: 58 },
    { label: 'Sat', p50: 28, p95: 43, p99: 51 },
    { label: 'Sun', p50: 26, p95: 41, p99: 49 },
  ],
};

export const errorRateByRange: Record<ObservabilityRange, TimeSeriesPoint[]> = {
  '1h': [
    { label: '00m', value: 0.4 },
    { label: '10m', value: 0.8 },
    { label: '20m', value: 1.1 },
    { label: '30m', value: 1.8 },
    { label: '40m', value: 1.2 },
    { label: '50m', value: 0.9 },
    { label: '60m', value: 0.6 },
  ],
  '6h': [
    { label: '00:00', value: 0.3 },
    { label: '01:00', value: 0.4 },
    { label: '02:00', value: 0.7 },
    { label: '03:00', value: 1.1 },
    { label: '04:00', value: 0.9 },
    { label: '05:00', value: 0.6 },
    { label: '06:00', value: 0.5 },
  ],
  '24h': [
    { label: '00:00', value: 0.5 },
    { label: '04:00', value: 0.3 },
    { label: '08:00', value: 0.8 },
    { label: '12:00', value: 1.2 },
    { label: '16:00', value: 2.1 },
    { label: '20:00', value: 1.5 },
    { label: '23:59', value: 0.7 },
  ],
  '7d': [
    { label: 'Mon', value: 0.6 },
    { label: 'Tue', value: 0.7 },
    { label: 'Wed', value: 1.1 },
    { label: 'Thu', value: 1.4 },
    { label: 'Fri', value: 2.0 },
    { label: 'Sat', value: 1.0 },
    { label: 'Sun', value: 0.8 },
  ],
};

export const retryCountByRange: Record<ObservabilityRange, TimeSeriesPoint[]> = {
  '1h': [
    { label: '00m', value: 1 },
    { label: '10m', value: 2 },
    { label: '20m', value: 3 },
    { label: '30m', value: 4 },
    { label: '40m', value: 3 },
    { label: '50m', value: 2 },
    { label: '60m', value: 1 },
  ],
  '6h': [
    { label: '00:00', value: 1 },
    { label: '01:00', value: 1 },
    { label: '02:00', value: 2 },
    { label: '03:00', value: 4 },
    { label: '04:00', value: 3 },
    { label: '05:00', value: 2 },
    { label: '06:00', value: 1 },
  ],
  '24h': [
    { label: '00:00', value: 2 },
    { label: '04:00', value: 1 },
    { label: '08:00', value: 3 },
    { label: '12:00', value: 5 },
    { label: '16:00', value: 8 },
    { label: '20:00', value: 4 },
    { label: '23:59', value: 2 },
  ],
  '7d': [
    { label: 'Mon', value: 6 },
    { label: 'Tue', value: 7 },
    { label: 'Wed', value: 9 },
    { label: 'Thu', value: 10 },
    { label: 'Fri', value: 14 },
    { label: 'Sat', value: 8 },
    { label: 'Sun', value: 6 },
  ],
};

export const duplicateEventsByRange: Record<ObservabilityRange, TimeSeriesPoint[]> = {
  '1h': [
    { label: '00m', value: 0 },
    { label: '10m', value: 1 },
    { label: '20m', value: 0 },
    { label: '30m', value: 2 },
    { label: '40m', value: 1 },
    { label: '50m', value: 0 },
    { label: '60m', value: 0 },
  ],
  '6h': [
    { label: '00:00', value: 0 },
    { label: '01:00', value: 0 },
    { label: '02:00', value: 1 },
    { label: '03:00', value: 2 },
    { label: '04:00', value: 1 },
    { label: '05:00', value: 0 },
    { label: '06:00', value: 0 },
  ],
  '24h': [
    { label: '00:00', value: 0 },
    { label: '04:00', value: 1 },
    { label: '08:00', value: 0 },
    { label: '12:00', value: 2 },
    { label: '16:00', value: 1 },
    { label: '20:00', value: 0 },
    { label: '23:59', value: 0 },
  ],
  '7d': [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 1 },
    { label: 'Wed', value: 2 },
    { label: 'Thu', value: 3 },
    { label: 'Fri', value: 4 },
    { label: 'Sat', value: 1 },
    { label: 'Sun', value: 1 },
  ],
};

export const recentSystemLogs: SystemLogItem[] = [
  {
    id: 'log_001',
    timestamp: '2026-03-06 14:45:22',
    level: 'INFO',
    service: 'payment-api',
    message: 'Payment processed successfully',
  },
  {
    id: 'log_002',
    timestamp: '2026-03-06 14:45:18',
    level: 'ERROR',
    service: 'webhook-handler',
    message: 'Failed to deliver webhook: Connection timeout',
  },
  {
    id: 'log_003',
    timestamp: '2026-03-06 14:45:15',
    level: 'WARN',
    service: 'settlement-service',
    message: 'Settlement delayed: Bank processing time exceeded',
  },
  {
    id: 'log_004',
    timestamp: '2026-03-06 14:45:10',
    level: 'INFO',
    service: 'payment-api',
    message: 'Idempotency key validated',
  },
  {
    id: 'log_005',
    timestamp: '2026-03-06 14:45:05',
    level: 'INFO',
    service: 'auth-service',
    message: 'API key authenticated',
  },
];