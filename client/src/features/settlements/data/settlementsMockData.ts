import type {
  NextSettlement,
  SettlementHistoryItem,
  SettlementMetricSummary,
} from '../types/settlements.types';

export const settlementMetrics: SettlementMetricSummary = {
  totalSettledLast7d: 197559.25,
  pendingSettlement: 38245.67,
  averageSettlementTime: '< 2 minutes',
  settlementAccuracy: '99.8%',
};

export const nextSettlement: NextSettlement = {
  scheduledFor: 'Scheduled for March 7, 2026 9:00 AM',
  status: 'pending',
  grossAmount: 38245.67,
  transactionCount: 847,
  estimatedFees: 1147.37,
  netSettlement: 37098.3,
};

export const settlementHistory: SettlementHistoryItem[] = [
  {
    id: 'SETT-20250305',
    amount: 42156.89,
    status: 'completed',
    scheduledDate: 'March 5, 2026',
    actualDate: 'March 5, 2026 9:03 AM',
    transactionCount: 923,
  },
  {
    id: 'SETT-20250304',
    amount: 38922.45,
    status: 'completed',
    scheduledDate: 'March 4, 2026',
    actualDate: 'March 4, 2026 9:01 AM',
    transactionCount: 856,
  },
  {
    id: 'SETT-20250303',
    amount: 35678.12,
    status: 'delayed',
    scheduledDate: 'March 3, 2026',
    actualDate: 'March 3, 2026 11:47 AM',
    transactionCount: 789,
  },
  {
    id: 'SETT-20250302',
    amount: 41234.56,
    status: 'completed',
    scheduledDate: 'March 2, 2026',
    actualDate: 'March 2, 2026 9:02 AM',
    transactionCount: 901,
  },
  {
    id: 'SETT-20250301',
    amount: 39567.23,
    status: 'completed',
    scheduledDate: 'March 1, 2026',
    actualDate: 'March 1, 2026 9:00 AM',
    transactionCount: 867,
  },
];