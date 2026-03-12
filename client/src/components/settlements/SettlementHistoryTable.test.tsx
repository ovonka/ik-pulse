import { render, screen } from '@testing-library/react';
import SettlementHistoryTable from './SettlementHistoryTable';

describe('SettlementHistoryTable', () => {
  it('renders settlement history rows', () => {
    render(
      <SettlementHistoryTable
        items={[
          {
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
            status: 'completed',
            scheduledFor: '2026-03-10T10:00:00.000Z',
            settledAt: '2026-03-10T12:00:00.000Z',
            createdAt: '2026-03-10T10:00:00.000Z',
            updatedAt: '2026-03-10T10:00:00.000Z',
          },
        ]}
      />
    );

    expect(
      screen.getByRole('heading', { name: /settlement history/i })
    ).toBeInTheDocument();

    expect(screen.getByText('sett_123')).toBeInTheDocument();
    expect(screen.getByText('ikhokha-sim')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });
});