import { useMemo, useState } from 'react';
import { usePollingQuery } from '../../merchant-ops/hooks/usePollingQuery';
import { getObservabilityOverviewRequest } from '../api/observabilityApi';
import type {
  ObservabilityChartsData,
  ObservabilityRange,
  ServiceHealthItem,
  SystemLogItem,
} from '../types/observability.types';

function mapRangeToBackend(range: ObservabilityRange): '1h' | '24h' | '7d' | '30d' {
  if (range === '1h') return '1h';
  if (range === '6h') return '24h';
  if (range === '24h') return '24h';
  return '7d';
}

function formatMs(value: number) {
  return `${value} ms`;
}

export function useObservabilityState() {
  const [range, setRange] = useState<ObservabilityRange>('24h');

  const { data } = usePollingQuery({
    queryFn: () =>
      getObservabilityOverviewRequest(mapRangeToBackend(range)),
    intervalMs: 15000,
    deps: [range],
  });

  const serviceHealthItems = useMemo<ServiceHealthItem[]>(() => {
    const successRate = data?.metrics.successRate ?? 0;
    const avgLatency = data?.metrics.avgEndToEndLatencyMs ?? 0;

    const degraded = successRate < 95 || avgLatency > 1500;

    return [
      {
        name: 'Payment API',
        status: degraded ? 'degraded' : 'healthy',
        uptime: successRate >= 99 ? '99.99%' : '99.7%',
        latency: formatMs(avgLatency),
      },
      {
        name: 'Webhook Service',
        status:
          (data?.metrics.failedTransactions ?? 0) > 0
            ? 'degraded'
            : 'healthy',
        uptime: '99.9%',
        latency: formatMs(
          data?.metrics.avgPlatformToProviderLatencyMs ?? 0
        ),
      },
      {
        name: 'Settlement Service',
        status: 'healthy',
        uptime: '99.95%',
        latency: '320 ms',
      },
      {
        name: 'Auth Service',
        status: 'healthy',
        uptime: '99.99%',
        latency: '110 ms',
      },
    ];
  }, [data]);

  const chartsData = useMemo<ObservabilityChartsData>(() => {
    const timeSeries = data?.timeSeries ?? [];
    const recentEvents = data?.recentEvents ?? [];
    const providerBreakdown = data?.providerBreakdown ?? [];
    const failureReasons = data?.failureReasons ?? [];
    const avgLatency = data?.metrics.avgEndToEndLatencyMs ?? 0;

    return {
      apiLatency: timeSeries.map((point) => ({
        label: point.label,
        p50: Math.round(avgLatency * 0.6),
        p95: Math.round(avgLatency * 0.9),
        p99: Math.round(avgLatency * 1.2),
      })),

      errorRate: timeSeries.map((point) => {
        const total =
          point.successCount + point.failedCount + point.pendingCount;

        return {
          label: point.label,
          value:
            total > 0
              ? Number(((point.failedCount / total) * 100).toFixed(2))
              : 0,
        };
      }),

      retryCount: timeSeries.map((point) => ({
        label: point.label,
        value: recentEvents.filter((event) => event.attemptNumber > 1).length,
      })),

      duplicateEvents: timeSeries.map((point) => ({
        label: point.label,
        value: recentEvents.filter((event) =>
          event.type.includes('retry')
        ).length,
      })),

      providerBreakdown: providerBreakdown.map((p) => ({
        provider: p.provider,
        successCount: p.successCount,
        failedCount: p.failedCount,
        pendingCount: p.pendingCount,
      })),

      failureReasons: failureReasons.map((f) => ({
        reason: f.reason,
        count: f.count,
      })),
    };
  }, [data]);

  const recentSystemLogs = useMemo<SystemLogItem[]>(() => {
    return (data?.recentEvents ?? []).map((event) => ({
      id: event.id.slice(0, 8),
      timestamp: new Date(event.createdAt).toLocaleString(),
      level:
        event.status === 'failed'
          ? 'ERROR'
          : event.status === 'pending'
          ? 'WARN'
          : 'INFO',
      service: event.provider,
      message:
        event.failureReason ??
        `${event.type.replaceAll('_', ' ')} processed`,
    }));
  }, [data]);

  return {
    range,
    setRange,
    serviceHealthItems,
    chartsData,
    recentSystemLogs,
  };
}