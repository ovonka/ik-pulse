import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('renders welcome heading, form fields, and sign-in button', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome to ik pulse/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders demo credentials section', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/kurt\.muller@ikpulse\.co\.za/i)).toBeInTheDocument();
    expect(screen.getByText(/password123!/i)).toBeInTheDocument();
  });
});