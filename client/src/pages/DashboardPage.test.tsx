import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from './DashboardPage';
import { usePollingQuery } from '../features/merchant-ops/hooks/usePollingQuery';
import { useToastStore } from '../app/store/toastStore';

vi.mock('../features/merchant-ops/hooks/usePollingQuery', () => ({
  usePollingQuery: vi.fn(),
}));

vi.mock('../app/store/toastStore', () => ({
  useToastStore: vi.fn(),
}));

const mockedUsePollingQuery = vi.mocked(usePollingQuery);
const mockedUseToastStore = vi.mocked(useToastStore);

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseToastStore.mockImplementation((selector) =>
      selector({
        showToast: vi.fn(),
      } as never)
    );
  });

  it('renders dashboard cards and chart headings', () => {
    mockedUsePollingQuery
      .mockReturnValueOnce({
        data: {
          metrics: {
            totalSales: 12500,
            successfulTransactions: 22,
            failedTransactions: 4,
            pendingTransactions: 3,
            nextSettlement: {
              id: 'sett-1',
              provider: 'ikhokha-sim',
              netAmount: 9900,
              scheduledFor: '2026-03-10T10:00:00.000Z',
              status: 'pending',
            },
          },
          statusBreakdown: {
            success: 22,
            failed: 4,
            pending: 3,
          },
          volumeSeries: [
            {
              label: '01 Mar',
              successfulAmount: 2000,
              failedAmount: 200,
              pendingAmount: 100,
              successfulCount: 4,
              failedCount: 1,
              pendingCount: 1,
            },
          ],
          recentFailedTransactions: [],
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never)
      .mockReturnValueOnce({
        data: {
          items: [],
          pagination: {
            page: 1,
            pageSize: 4,
            totalItems: 0,
            totalPages: 1,
          },
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never);

    render(<DashboardPage />);

    expect(screen.getByRole('button', { name: /total sales/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /successful transactions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /failed transactions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /pending transactions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next settlement/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /transaction volume/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /status breakdown/i })
    ).toBeInTheDocument();
  });

  it('changes table title when a metric card is selected', async () => {
    const user = userEvent.setup();

    mockedUsePollingQuery
      .mockReturnValue({
        data: {
          metrics: {
            totalSales: 12500,
            successfulTransactions: 22,
            failedTransactions: 4,
            pendingTransactions: 3,
            nextSettlement: {
              id: 'sett-1',
              provider: 'ikhokha-sim',
              netAmount: 9900,
              scheduledFor: '2026-03-10T10:00:00.000Z',
              status: 'pending',
            },
          },
          statusBreakdown: {
            success: 22,
            failed: 4,
            pending: 3,
          },
          volumeSeries: [],
          recentFailedTransactions: [],
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never);

    render(<DashboardPage />);

    await user.click(screen.getByRole('button', { name: /successful transactions/i }));

    expect(
      screen.getByRole('heading', { name: /recent successful transactions/i })
    ).toBeInTheDocument();
  });

  it('dismisses the failure alert when close is clicked', async () => {
    const user = userEvent.setup();

    mockedUsePollingQuery
      .mockReturnValueOnce({
        data: {
          metrics: {
            totalSales: 12500,
            successfulTransactions: 22,
            failedTransactions: 4,
            pendingTransactions: 3,
            nextSettlement: {
              id: 'sett-1',
              provider: 'ikhokha-sim',
              netAmount: 9900,
              scheduledFor: '2026-03-10T10:00:00.000Z',
              status: 'pending',
            },
          },
          statusBreakdown: {
            success: 22,
            failed: 4,
            pending: 3,
          },
          volumeSeries: [],
          recentFailedTransactions: [],
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never)
      .mockReturnValueOnce({
        data: {
          items: [],
          pagination: {
            page: 1,
            pageSize: 4,
            totalItems: 0,
            totalPages: 1,
          },
        },
        status: 'success',
        error: null,
        refetch: vi.fn(),
      } as never);

    render(<DashboardPage />);

    expect(screen.getByText(/failed transactions detected/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /dismiss/i }));

    expect(screen.queryByText(/failed transactions detected/i)).not.toBeInTheDocument();
  });
});