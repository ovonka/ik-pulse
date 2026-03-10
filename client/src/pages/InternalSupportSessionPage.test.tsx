import { fireEvent, render, screen } from '@testing-library/react';
import InternalSupportSessionPage from './InternalSupportSessionPage';
import { useSupportDebugStore } from '../app/store/supportDebugStore';
import { useToastStore } from '../app/store/toastStore';

vi.mock('../app/store/supportDebugStore', () => ({
  useSupportDebugStore: vi.fn(),
}));

vi.mock('../app/store/toastStore', () => ({
  useToastStore: vi.fn(),
}));

const mockedUseSupportDebugStore = vi.mocked(useSupportDebugStore);
const mockedUseToastStore = vi.mocked(useToastStore);

describe('InternalSupportSessionPage', () => {
  const showToast = vi.fn();
  const resolveSupportSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseToastStore.mockImplementation((selector) =>
      selector({
        showToast,
      } as never)
    );
  });

  it('renders empty state when there is no active debug session', () => {
    const mockState = {
      debugContext: null,
      resolveSupportSession,
    };

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector(mockState as never)
    );

    render(<InternalSupportSessionPage />);

    expect(screen.getByText(/no active support session loaded/i)).toBeInTheDocument();
  });

  it('renders support session details when debug context exists', () => {
    const mockState = {
      debugContext: {
        session: {
          id: 'session-1',
          merchantId: 'merchant-1',
          branchId: null,
          supportCode: 'ABC123',
          status: 'used',
          accessScope: 'read_only',
          reason: 'Transactions are failing on one device',
          resolutionNote: null,
          expiresAt: '2026-03-10T12:00:00.000Z',
          consumedAt: '2026-03-10T11:45:00.000Z',
          revokedAt: null,
          resolvedAt: null,
          createdAt: '2026-03-10T11:30:00.000Z',
        },
        merchantContext: {
          merchantId: 'merchant-1',
          merchantName: 'Acme Stores',
          branchId: null,
          requestedByEmail: 'merchant@ikpulse.co.za',
        },
      },
      resolveSupportSession,
    };

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector(mockState as never)
    );

    render(<InternalSupportSessionPage />);

    expect(
      screen.getByRole('heading', { name: /resolve support session/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/acme stores/i)).toBeInTheDocument();
    expect(screen.getByText(/merchant@ikpulse.co.za/i)).toBeInTheDocument();
    expect(screen.getByText(/ABC123/i)).toBeInTheDocument();
    expect(screen.getByText(/transactions are failing on one device/i)).toBeInTheDocument();
  });

  it('disables resolve action when resolution note is too short', () => {
    const mockState = {
      debugContext: {
        session: {
          id: 'session-1',
          merchantId: 'merchant-1',
          branchId: null,
          supportCode: 'ABC123',
          status: 'used',
          accessScope: 'read_only',
          reason: 'Transactions are failing on one device',
          resolutionNote: null,
          expiresAt: '2026-03-10T12:00:00.000Z',
          consumedAt: '2026-03-10T11:45:00.000Z',
          revokedAt: null,
          resolvedAt: null,
          createdAt: '2026-03-10T11:30:00.000Z',
        },
        merchantContext: {
          merchantId: 'merchant-1',
          merchantName: 'Acme Stores',
          branchId: null,
          requestedByEmail: 'merchant@ikpulse.co.za',
        },
      },
      resolveSupportSession,
    };

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector(mockState as never)
    );

    render(<InternalSupportSessionPage />);

    fireEvent.change(screen.getByLabelText(/resolution note/i), {
      target: { value: 'abc' },
    });

    expect(
      screen.getByRole('button', { name: /resolve support session/i })
    ).toBeDisabled();

    expect(resolveSupportSession).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
  });

  it('submits a valid resolution note', () => {
    resolveSupportSession.mockResolvedValue(undefined);

    const mockState = {
      debugContext: {
        session: {
          id: 'session-1',
          merchantId: 'merchant-1',
          branchId: null,
          supportCode: 'ABC123',
          status: 'used',
          accessScope: 'read_only',
          reason: 'Transactions are failing on one device',
          resolutionNote: null,
          expiresAt: '2026-03-10T12:00:00.000Z',
          consumedAt: '2026-03-10T11:45:00.000Z',
          revokedAt: null,
          resolvedAt: null,
          createdAt: '2026-03-10T11:30:00.000Z',
        },
        merchantContext: {
          merchantId: 'merchant-1',
          merchantName: 'Acme Stores',
          branchId: null,
          requestedByEmail: 'merchant@ikpulse.co.za',
        },
      },
      resolveSupportSession,
    };

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector(mockState as never)
    );

    render(<InternalSupportSessionPage />);

    fireEvent.change(screen.getByLabelText(/resolution note/i), {
      target: { value: 'Issue investigated and merchant informed.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /resolve support session/i }));

    expect(resolveSupportSession).toHaveBeenCalledWith(
      'Issue investigated and merchant informed.'
    );
  });
});