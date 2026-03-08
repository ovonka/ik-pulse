import { useMemo, useState } from 'react';
import { initialSimulatorLogs } from '../data/simulatorMockData';
import type {
  SimulatorEventType,
  SimulatorLogItem,
  SimulatorStats,
} from '../types/simulator.types';
import { useToastStore } from '../../../app/store/toastStore';

function createTimestamp() {
  return new Date().toLocaleString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

function createShortKey(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

export function useSimulatorState() {
  const [logs, setLogs] = useState<SimulatorLogItem[]>(initialSimulatorLogs);
  const showToast = useToastStore((state) => state.showToast);

  const stats: SimulatorStats = useMemo(() => {
    return {
      totalEvents: logs.length,
      success: logs.filter((item) => item.severity === 'success').length,
      warnings: logs.filter((item) => item.severity === 'warning').length,
      errors: logs.filter((item) => item.severity === 'error').length,
    };
  }, [logs]);

  const prependLog = (log: SimulatorLogItem) => {
    setLogs((current) => [log, ...current].slice(0, 20));
  };

  const simulateEvent = (type: SimulatorEventType) => {
    const timestamp = createTimestamp();

    if (type === 'payment-success') {
      const transactionId = `TXN-${Date.now()}`;
      const eventId = createId('evt');
      const idempotencyKey = createShortKey('idem');

      prependLog({
        id: createId('log'),
        eventId,
        category: 'Payment',
        title: 'Payment succeeded',
        message: `${transactionId} processed successfully`,
        timestamp,
        severity: 'success',
        referenceId: transactionId,
        idempotencyKey,
      });

      showToast({
        type: 'success',
        title: 'Payment Success Simulated',
        message: `${transactionId} processed successfully`,
      });
      return;
    }

    if (type === 'payment-failure') {
      const transactionId = `TXN-${Date.now()}`;
      const eventId = createId('evt');
      const idempotencyKey = createShortKey('idem');

      prependLog({
        id: createId('log'),
        eventId,
        category: 'Payment',
        title: 'Payment failed',
        message: `${transactionId} declined - Insufficient funds`,
        timestamp,
        severity: 'error',
        referenceId: transactionId,
        idempotencyKey,
      });

      showToast({
        type: 'error',
        title: 'Payment Failure Simulated',
        message: `${transactionId} declined due to insufficient funds`,
      });
      return;
    }

    if (type === 'duplicate-webhook') {
      const webhookId = `WHK-${Date.now()}`;
      const eventId = createId('evt');
      const idempotencyKey = createShortKey('idem');

      prependLog({
        id: createId('log'),
        eventId,
        category: 'Webhook',
        title: 'Duplicate webhook detected',
        message: `${webhookId} matched existing idempotency key`,
        timestamp,
        severity: 'warning',
        referenceId: webhookId,
        idempotencyKey,
      });

      showToast({
        type: 'warning',
        title: 'Duplicate Webhook Simulated',
        message: `${webhookId} flagged as duplicate`,
      });
      return;
    }

    if (type === 'delayed-settlement') {
      const settlementId = `SETT-${Date.now()}`;
      const eventId = createId('evt');

      prependLog({
        id: createId('log'),
        eventId,
        category: 'Settlement',
        title: 'Settlement delayed',
        message: `${settlementId} delayed - Bank processing time exceeded`,
        timestamp,
        severity: 'warning',
        referenceId: settlementId,
      });

      showToast({
        type: 'warning',
        title: 'Delayed Settlement Simulated',
        message: `${settlementId} is experiencing delays`,
      });
      return;
    }
  };

  const clearLogs = () => {
    setLogs([]);

    showToast({
      type: 'info',
      title: 'Logs Cleared',
      message: 'Event log stream has been reset.',
    });
  };

  return {
    logs,
    stats,
    simulateEvent,
    clearLogs,
  };
}