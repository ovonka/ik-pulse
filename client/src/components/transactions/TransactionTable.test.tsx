import { fireEvent, render, screen } from '@testing-library/react';
import TransactionTable from './TransactionTable';

describe('TransactionTable', () => {
  const items = [
    {
      id: 'tx-1',
      merchantId: 'merchant-1',
      branchId: null,
      transactionSourceId: null,
      provider: 'ikhokha-sim',
      providerTransactionRef: 'prov_123',
      idempotencyKey: 'idem_123',
      amount: 1200,
      currency: 'ZAR',
      status: 'failed' as const,
      transactionType: 'card_payment',
      paymentMethod: 'Visa •••• 4242',
      failureReason: 'Network timeout',
      retryOfTransactionId: null,
      attemptNumber: 1,
      initiatedAt: null,
      receivedAt: null,
      completedAt: null,
      createdAt: '2026-03-10T10:00:00.000Z',
      updatedAt: '2026-03-10T10:00:00.000Z',
    },
    {
      id: 'tx-2',
      merchantId: 'merchant-1',
      branchId: null,
      transactionSourceId: null,
      provider: 'ikhokha-sim',
      providerTransactionRef: 'prov_456',
      idempotencyKey: 'idem_456',
      amount: 550,
      currency: 'ZAR',
      status: 'success' as const,
      transactionType: 'card_payment',
      paymentMethod: 'Mastercard •••• 5555',
      failureReason: null,
      retryOfTransactionId: null,
      attemptNumber: 1,
      initiatedAt: null,
      receivedAt: null,
      completedAt: null,
      createdAt: '2026-03-10T10:05:00.000Z',
      updatedAt: '2026-03-10T10:05:00.000Z',
    },
  ];

  it('renders transaction rows', () => {
    render(<TransactionTable items={items} onRetry={vi.fn()} />);

    expect(screen.getByText('prov_123')).toBeInTheDocument();
    expect(screen.getByText('prov_456')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('shows retry button only for failed transactions and calls onRetry', () => {
    const onRetry = vi.fn();

    render(<TransactionTable items={items} onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledWith('tx-1');
  });
});