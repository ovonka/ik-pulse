import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ObservabilityPage from './ObservabilityPage';

describe('ObservabilityPage', () => {
  it('renders observability page sections', () => {
    render(<ObservabilityPage />);

    expect(screen.getByText(/^Observability$/i)).toBeInTheDocument();

    expect(screen.getByText(/total transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/failed transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/success rate/i)).toBeInTheDocument();
    expect(screen.getByText(/avg end-to-end latency/i)).toBeInTheDocument();

    expect(screen.getByText(/transaction status trend/i)).toBeInTheDocument();
    expect(screen.getByText(/provider breakdown/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /failure reasons/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /recent events/i })).toBeInTheDocument();
  });

  it('switches chart time range to 1h', async () => {
    const user = userEvent.setup();

    render(<ObservabilityPage />);

    await user.click(screen.getByRole('button', { name: /1h/i }));

    expect(screen.getByText(/transaction status trend/i)).toBeInTheDocument();
    expect(screen.getByText(/provider breakdown/i)).toBeInTheDocument();
  });
});