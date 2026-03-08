export type SimulatorEventType =
  | 'payment-success'
  | 'payment-failure'
  | 'duplicate-webhook'
  | 'delayed-settlement'
  | 'system';

export type SimulatorSeverity = 'success' | 'warning' | 'error' | 'info';

export type SimulatorLogItem = {
  id: string;
  eventId: string;
  category: 'Payment' | 'Webhook' | 'Settlement' | 'System';
  title: string;
  message: string;
  timestamp: string;
  severity: SimulatorSeverity;
  referenceId?: string;
  idempotencyKey?: string;
};

export type SimulatorStats = {
  totalEvents: number;
  success: number;
  warnings: number;
  errors: number;
};