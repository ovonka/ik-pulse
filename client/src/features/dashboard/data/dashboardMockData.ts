import type {
  RecentTransaction,
  StatusBreakdownItem,
  TransactionVolumePoint,
} from '../types/dashboard.types';

export const dashboardSummary = {
  totalSalesToday: 42847,
  successfulTransactions: 847,
  failedTransactions: 23,
  pendingTransactions: 14,
  nextSettlement: 38245,
  nextSettlementDate: 'Tomorrow 9 AM',
  salesGrowth: 12.5,
  successGrowth: 8.2,
  failedDelta: 3,
};

export const transactionVolumeByRange: Record<
  '24h' | '3d' | '7d' | '14d' | '30d',
  TransactionVolumePoint[]
> = {
  '24h': [
    { label: '00:00', value: 24 },
    { label: '04:00', value: 18 },
    { label: '08:00', value: 42 },
    { label: '12:00', value: 67 },
    { label: '16:00', value: 85 },
    { label: '20:00', value: 52 },
    { label: '23:59', value: 31 },
  ],
  '3d': [
    { label: 'Day 1', value: 120 },
    { label: 'Day 2', value: 180 },
    { label: 'Day 3', value: 145 },
  ],
  '7d': [
    { label: 'Mon', value: 80 },
    { label: 'Tue', value: 110 },
    { label: 'Wed', value: 135 },
    { label: 'Thu', value: 160 },
    { label: 'Fri', value: 210 },
    { label: 'Sat', value: 175 },
    { label: 'Sun', value: 140 },
  ],
  '14d': [
    { label: 'D1', value: 60 },
    { label: 'D2', value: 72 },
    { label: 'D3', value: 84 },
    { label: 'D4', value: 90 },
    { label: 'D5', value: 95 },
    { label: 'D6', value: 110 },
    { label: 'D7', value: 120 },
    { label: 'D8', value: 130 },
    { label: 'D9', value: 125 },
    { label: 'D10', value: 140 },
    { label: 'D11', value: 138 },
    { label: 'D12', value: 150 },
    { label: 'D13', value: 160 },
    { label: 'D14', value: 145 },
  ],
  '30d': [
    { label: 'W1', value: 420 },
    { label: 'W2', value: 510 },
    { label: 'W3', value: 620 },
    { label: 'W4', value: 580 },
  ],
};

export const statusBreakdownByRange: Record<
  '24h' | '3d' | '7d' | '14d' | '30d',
  StatusBreakdownItem[]
> = {
  '24h': [
    { name: 'Success', value: 96 },
    { name: 'Failed', value: 3 },
    { name: 'Pending', value: 1 },
  ],
  '3d': [
    { name: 'Success', value: 280 },
    { name: 'Failed', value: 12 },
    { name: 'Pending', value: 8 },
  ],
  '7d': [
    { name: 'Success', value: 847 },
    { name: 'Failed', value: 23 },
    { name: 'Pending', value: 14 },
  ],
  '14d': [
    { name: 'Success', value: 1620 },
    { name: 'Failed', value: 49 },
    { name: 'Pending', value: 22 },
  ],
  '30d': [
    { name: 'Success', value: 3410 },
    { name: 'Failed', value: 108 },
    { name: 'Pending', value: 57 },
  ],
};

export const recentTransactions: RecentTransaction[] = [
  {
    id: 'TXN-20250306-001',
    merchant: 'Acme Corp',
    amount: 245.99,
    paymentMethod: 'Visa •••• 4242',
    timestamp: '2026-03-06 14:23:11',
    reason: 'Insufficient funds',
    status: 'failed',
  },
  {
    id: 'TXN-20250306-002',
    merchant: 'Widget Inc',
    amount: 89.5,
    paymentMethod: 'MC •••• 5555',
    timestamp: '2026-03-06 14:18:45',
    reason: 'Card declined',
    status: 'failed',
  },
  {
    id: 'TXN-20250306-003',
    merchant: 'Tech Solutions',
    amount: 1250,
    paymentMethod: 'Amex •••• 1234',
    timestamp: '2026-03-06 13:56:22',
    reason: 'Network timeout',
    status: 'failed',
  },
  {
    id: 'TXN-20250306-004',
    merchant: 'Green Mart',
    amount: 312.75,
    paymentMethod: 'Visa •••• 8891',
    timestamp: '2026-03-06 13:12:09',
    status: 'success',
  },
  {
    id: 'TXN-20250306-005',
    merchant: 'Urban Foods',
    amount: 640.2,
    paymentMethod: 'EFT',
    timestamp: '2026-03-06 12:48:00',
    status: 'success',
  },
  {
    id: 'TXN-20250306-006',
    merchant: 'Quick Parts',
    amount: 74.99,
    paymentMethod: 'Visa •••• 1001',
    timestamp: '2026-03-06 12:14:43',
    status: 'pending',
  },
  {
    id: 'TXN-20250306-007',
    merchant: 'Blue Retail',
    amount: 415.0,
    paymentMethod: 'MC •••• 2211',
    timestamp: '2026-03-06 11:59:28',
    status: 'pending',
  },
];