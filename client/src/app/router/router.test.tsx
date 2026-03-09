import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import AppRouter from './index';
import { useAuthStore } from '../store/authStore';

describe('AppRouter', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
      error: null,
    });
  });

  it('renders the login page on /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome to ik pulse/i })).toBeInTheDocument();
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/kurt\.muller@ikpulse\.co\.za/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated users away from /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome to ik pulse/i })).toBeInTheDocument();
  });

  it('renders dashboard for authenticated merchant users', () => {
    useAuthStore.setState({
      user: {
        id: 'user_1',
        email: 'kurt.muller@ikpulse.co.za',
        role: 'merchant',
        merchantId: 'merchant_1',
        branchId: 'branch_1',
      },
      accessToken: 'token',
      status: 'authenticated',
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText(/dashboard overview/i)).toBeInTheDocument();
  });
});