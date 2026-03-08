import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import AppRouter from './index';

describe('AppRouter', () => {
  it('renders the login page on /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /login/i })
    ).toBeInTheDocument();
  });

  it('renders the dashboard layout on /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /dashboard overview/i })
    ).toBeInTheDocument();
  });
});