import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
  it('renders dashboard cards and chart headings', () => {
    render(<DashboardPage />);

    expect(screen.getByRole('button', { name: /total sales today/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /successful transactions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /failed transactions/i })).toBeInTheDocument();
    expect(screen.getByText(/transaction volume/i)).toBeInTheDocument();
    expect(screen.getByText(/status breakdown/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /24h/i })).toBeInTheDocument();
  });

  it('changes table title when a metric card is selected', async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    await user.click(screen.getByRole('button', { name: /successful transactions/i }));

    expect(screen.getByText(/recent successful transactions/i)).toBeInTheDocument();
  });

  it('dismisses the failure alert when close is clicked', async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    await user.click(screen.getByRole('button', { name: /dismiss alert/i }));

    expect(screen.queryByText(/high failure rate detected/i)).not.toBeInTheDocument();
  });
});