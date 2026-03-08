import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsPage from './TransactionsPage';

describe('TransactionsPage', () => {
  it('renders transactions page content', () => {
    render(<TransactionsPage />);

    expect(
      screen.getByPlaceholderText(/search by transaction id, merchant, or idempotency key/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/transaction id/i)).toBeInTheDocument();
    expect(screen.getByText(/merchant/i)).toBeInTheDocument();
    expect(screen.getByText(/idempotency key/i)).toBeInTheDocument();
  });

  it('filters transactions by status', async () => {
    const user = userEvent.setup();

    render(<TransactionsPage />);

    await user.click(screen.getByRole('button', { name: /failed/i }));

    expect(screen.getAllByText(/retry/i).length).toBeGreaterThan(0);
  });

  it('filters transactions by search text', async () => {
    const user = userEvent.setup();

    render(<TransactionsPage />);

    const searchInput = screen.getByPlaceholderText(
      /search by transaction id, merchant, or idempotency key/i
    );

    await user.clear(searchInput);
    await user.type(searchInput, 'Acme');

    expect(screen.getByText(/acme corp/i)).toBeInTheDocument();
  });

  it('shows the empty state when no transactions match search', async () => {
    const user = userEvent.setup();

    render(<TransactionsPage />);

    const searchInput = screen.getByPlaceholderText(
      /search by transaction id, merchant, or idempotency key/i
    );

    await user.clear(searchInput);
    await user.type(searchInput, 'cc');

    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/try adjusting your search or filter criteria/i)
    ).toBeInTheDocument();
  });
});