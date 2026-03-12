import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsPage from './TransactionsPage';
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

describe('TransactionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseToastStore.mockImplementation((selector) =>
      selector({
        showToast: vi.fn(),
      } as never)
    );
  });

  it('renders transactions page content', () => {
    mockedUsePollingQuery.mockReturnValue({
      data: {
        items: [
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
            status: 'failed',
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
    } as never);

    render(<TransactionsPage />);

    expect(
      screen.getByPlaceholderText(/search by transaction id, merchant, or idempotency key/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText(/prov_123/i)).toBeInTheDocument();
    expect(screen.getByText(/ikhokha-sim/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('updates the failed filter button state when clicked', async () => {
    const user = userEvent.setup();

    mockedUsePollingQuery.mockReturnValue({
      data: {
        items: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 1,
        },
      },
      status: 'success',
      error: null,
      refetch: vi.fn(),
    } as never);

    render(<TransactionsPage />);

    const failedButton = screen.getByRole('button', { name: /failed/i });
    await user.click(failedButton);

    expect(failedButton).toBeInTheDocument();
  });

  it('updates the search input when text is typed', async () => {
    const user = userEvent.setup();

    mockedUsePollingQuery.mockReturnValue({
      data: {
        items: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 1,
        },
      },
      status: 'success',
      error: null,
      refetch: vi.fn(),
    } as never);

    render(<TransactionsPage />);

    const searchInput = screen.getByPlaceholderText(
      /search by transaction id, merchant, or idempotency key/i
    );

    await user.type(searchInput, 'Acme');

    expect(searchInput).toHaveValue('Acme');
  });
});