import { render, screen } from '@testing-library/react';
import SupportDebugBanner from '../components/SupportDebugBanner';
import { useSupportDebugStore } from '../app/store/supportDebugStore';

vi.mock('../app/store/supportDebugStore', () => ({
  useSupportDebugStore: vi.fn(),
}));

const mockedUseSupportDebugStore = vi.mocked(useSupportDebugStore);

describe('SupportDebugBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when there is no debug context', () => {
    const mockState = {
      debugContext: null,
      clearDebugContext: vi.fn(),
    };

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector(mockState as never)
    );

    const { container } = render(<SupportDebugBanner />);

    expect(container.firstChild).toBeNull();
  });

  it('renders active merchant debug context', () => {
    const mockState = {
      debugContext: {
        session: {
          id: 'session-1',
          merchantId: 'merchant-1',
          branchId: null,
          supportCode: 'ABC123',
          status: 'used',
          accessScope: 'read_only',
          reason: 'Transactions are failing',
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
      clearDebugContext: vi.fn(),
    };

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector(mockState as never)
    );

    render(<SupportDebugBanner />);

    expect(screen.getByText(/active support debug context/i)).toBeInTheDocument();
    expect(screen.getByText(/acme stores/i)).toBeInTheDocument();
    expect(screen.getByText(/merchant@ikpulse.co.za/i)).toBeInTheDocument();
    expect(screen.getByText(/ABC123/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /clear/i })
    ).not.toBeInTheDocument();
  });
});