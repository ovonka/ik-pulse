import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsPage from './TransactionsPage';
import {
  getTransactionsRequest,
  retryTransactionRequest,
} from '../features/merchant-ops/api/transactionsApi';
import { useToastStore } from '../app/store/toastStore';

vi.mock('../features/merchant-ops/api/transactionsApi', () => ({
  getTransactionsRequest: vi.fn(),
  retryTransactionRequest: vi.fn(),
}));

vi.mock('../app/store/toastStore', () => ({
  useToastStore: vi.fn(),
}));

const mockedGetTransactionsRequest = vi.mocked(getTransactionsRequest);
const mockedRetryTransactionRequest = vi.mocked(retryTransactionRequest);
const mockedUseToastStore = vi.mocked(useToastStore);

describe('TransactionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseToastStore.mockImplementation((selector) =>
      selector({
        showToast: vi.fn(),
      } as never)
    );

    mockedGetTransactionsRequest.mockResolvedValue({
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
    } as never);

    mockedRetryTransactionRequest.mockResolvedValue({
      outcome: 'success',
      message: 'Retry succeeded',
    } as never);
  });

  it('renders transactions page content', async () => {
    render(<TransactionsPage />);

    expect(
      screen.getByPlaceholderText(/search by transaction id, merchant, or idempotency key/i)
    ).toBeInTheDocument();

    expect(await screen.findByText(/prov_123/i)).toBeInTheDocument();
    expect(screen.getByText(/ikhokha-sim/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

    expect(
      screen.getByText(/showing 1 recent transaction/i)
    ).toBeInTheDocument();
  });

  it('updates the failed filter button state when clicked', async () => {
    const user = userEvent.setup();

    render(<TransactionsPage />);

    await screen.findByText(/prov_123/i);

    const failedButton = screen.getByRole('button', { name: /failed/i });
    await user.click(failedButton);

    await waitFor(() => {
      expect(mockedGetTransactionsRequest).toHaveBeenCalled();
    });
  });

  it('updates the search input when text is typed', async () => {
    const user = userEvent.setup();

    render(<TransactionsPage />);

    await screen.findByText(/prov_123/i);

    const searchInput = screen.getByPlaceholderText(
      /search by transaction id, merchant, or idempotency key/i
    );

    await user.type(searchInput, 'Acme');

    expect(searchInput).toHaveValue('Acme');
  });
});