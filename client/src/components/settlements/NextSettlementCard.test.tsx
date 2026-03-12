import { render, screen } from '@testing-library/react';
import NextSettlementCard from './NextSettlementCard';

describe('NextSettlementCard', () => {
  it('renders empty state when there is no settlement', () => {
    render(<NextSettlementCard settlement={null} />);

    expect(screen.getByText(/no upcoming settlement found/i)).toBeInTheDocument();
  });

  it('renders settlement details when settlement exists', () => {
    render(
      <NextSettlementCard
        settlement={{
          id: 'sett-1',
          merchantId: 'merchant-1',
          branchId: null,
          transactionSourceId: null,
          provider: 'ikhokha-sim',
          providerSettlementRef: 'sett_123',
          grossAmount: 10000,
          feeAmount: 100,
          netAmount: 9900,
          transactionCount: 10,
          status: 'pending',
          scheduledFor: '2026-03-10T10:00:00.000Z',
          settledAt: null,
          createdAt: '2026-03-10T10:00:00.000Z',
          updatedAt: '2026-03-10T10:00:00.000Z',
        }}
      />
    );

    expect(
      screen.getByRole('heading', { name: /next settlement/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/ikhokha-sim/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });
});