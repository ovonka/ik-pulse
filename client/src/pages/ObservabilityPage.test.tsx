import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ObservabilityPage from './ObservabilityPage';

describe('ObservabilityPage', () => {
  it('renders observability page sections', () => {
    render(<ObservabilityPage />);

    expect(screen.getByText(/payment api/i)).toBeInTheDocument();
    expect(screen.getByText(/webhook service/i)).toBeInTheDocument();
    expect(screen.getByText(/settlement service/i)).toBeInTheDocument();
    expect(screen.getByText(/auth service/i)).toBeInTheDocument();

    expect(screen.getByText(/api latency \(24h\)/i)).toBeInTheDocument();
    expect(screen.getByText(/error rate % \(24h\)/i)).toBeInTheDocument();
    expect(screen.getByText(/retry count \(24h\)/i)).toBeInTheDocument();
    expect(screen.getByText(/duplicate events \(24h\)/i)).toBeInTheDocument();

    expect(screen.getByText(/recent system logs/i)).toBeInTheDocument();
  });

  it('switches chart time range to 1h', async () => {
    const user = userEvent.setup();

    render(<ObservabilityPage />);

    await user.click(screen.getByRole('button', { name: /1h/i }));

    expect(screen.getByText(/api latency \(1h\)/i)).toBeInTheDocument();
    expect(screen.getByText(/error rate % \(1h\)/i)).toBeInTheDocument();
  });
});