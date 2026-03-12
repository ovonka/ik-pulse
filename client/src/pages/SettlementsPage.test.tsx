import { render, screen } from '@testing-library/react';
import SettlementsPage from './SettlementsPage';
import { usePollingQuery } from '../features/merchant-ops/hooks/usePollingQuery';

vi.mock('../features/merchant-ops/hooks/usePollingQuery', () => ({
  usePollingQuery: vi.fn(),
}));

const mockedUsePollingQuery = vi.mocked(usePollingQuery);

describe('SettlementsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders settlement page content with backend-driven data', () => {
    mockedUsePollingQuery
      .mockReturnValueOnce({
        data: {
          items: [
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
              status: 'pending',
              scheduledFor: '2026-03-10T10:00:00.000Z',
              settledAt: null,
              createdAt: '2026-03-10T10:00:00.000Z',
              updatedAt: '2026-03-10T10:00:00.000Z',
            },
          ],
          pagination: {
            page: 1,
            pageSize: 10,
            totalItems: 1,
            totalPages: 1,
          },
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never)
      .mockReturnValueOnce({
        data: {
          totalSettledAmount: 50000,
          pendingSettlementAmount: 9900,
          averageSettlementValue: 25000,
          completedCount: 2,
          pendingCount: 1,
          delayedCount: 0,
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never);

    render(<SettlementsPage />);

    expect(screen.getByText(/^Total Settled$/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Settlement/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Settlement Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Settlement Accuracy/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /next settlement/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /settlement history/i })
    ).toBeInTheDocument();

    expect(screen.getByText('sett_123')).toBeInTheDocument();
    expect(screen.getAllByText(/ikhokha-sim/i).length).toBeGreaterThan(0);
  });
});