import { fireEvent, render, screen } from '@testing-library/react';
import RecentTransactionsTable from './RecentTransactionsTable';

describe('RecentTransactionsTable', () => {
  const items = [
    {
      id: 'TXN-001',
      rawId: 'raw-001',
      merchant: 'Current Merchant',
      amount: 1200,
      paymentMethod: 'Visa •••• 4242',
      timestamp: '2026-03-10 10:00',
      reason: 'Network timeout',
      status: 'failed' as const,
    },
    {
      id: 'TXN-002',
      rawId: 'raw-002',
      merchant: 'Current Merchant',
      amount: 950,
      paymentMethod: 'Mastercard •••• 5555',
      timestamp: '2026-03-10 10:05',
      reason: null,
      status: 'success' as const,
    },
  ];

  it('renders title and table rows', () => {
    render(
      <RecentTransactionsTable
        title="Recent Failed Transactions"
        items={items}
        onRetry={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: /recent failed transactions/i })
    ).toBeInTheDocument();

    expect(screen.getByText('TXN-001')).toBeInTheDocument();
    expect(screen.getByText('TXN-002')).toBeInTheDocument();
  });

  it('calls onRetry with the raw id when retry is clicked on a failed row', () => {
    const onRetry = vi.fn();

    render(
      <RecentTransactionsTable
        title="Recent Failed Transactions"
        items={items}
        onRetry={onRetry}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledWith('raw-001');
  });
});