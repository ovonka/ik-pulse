import { render, screen } from '@testing-library/react';
import SupportDebugBanner from '../components/SupportDebugBanner';
import { useSupportDebugStore } from '../app/store/supportDebugStore';
import { useAuthStore } from '../app/store/authStore';

vi.mock('../app/store/supportDebugStore', () => ({
  useSupportDebugStore: vi.fn(),
}));

vi.mock('../app/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const mockedUseSupportDebugStore = vi.mocked(useSupportDebugStore);
const mockedUseAuthStore = vi.mocked(useAuthStore);

describe('SupportDebugBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when there is no debug context', () => {
    mockedUseAuthStore.mockImplementation((selector) =>
      selector({
        user: {
          id: 'admin-1',
          email: 'admin@ikpulse.co.za',
          role: 'admin',
        },
      } as never)
    );

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector({
        debugContext: null,
      } as never)
    );

    render(<SupportDebugBanner />);

    expect(screen.queryByText(/active troubleshoot/i)).not.toBeInTheDocument();
  });

  it('renders active merchant debug context', () => {
    mockedUseAuthStore.mockImplementation((selector) =>
      selector({
        user: {
          id: 'support-1',
          email: 'support@ikpulse.co.za',
          role: 'support',
        },
      } as never)
    );

    mockedUseSupportDebugStore.mockImplementation((selector) =>
      selector({
        debugContext: {
          session: {
            supportCode: 'ABC123',
          },
          merchantContext: {
            merchantId: 'merchant-1',
            merchantName: 'Acme Stores',
            branchId: null,
            requestedByEmail: 'merchant@ikpulse.co.za',
          },
        },
      } as never)
    );

    render(<SupportDebugBanner />);

    expect(screen.getByText(/active troubleshoot/i)).toBeInTheDocument();
    expect(screen.getByText(/acme stores/i)).toBeInTheDocument();
    expect(screen.getByText(/merchant@ikpulse.co.za/i)).toBeInTheDocument();
    expect(screen.getByText(/abc123/i)).toBeInTheDocument();
  });
});