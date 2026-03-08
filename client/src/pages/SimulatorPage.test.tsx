import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SimulatorPage from './SimulatorPage';

describe('SimulatorPage', () => {
  it('renders simulator sections', () => {
    render(<SimulatorPage />);

    expect(screen.getByText(/simulate events/i)).toBeInTheDocument();
    expect(screen.getByText(/event statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/event log stream/i)).toBeInTheDocument();
  });

  it('starts with an empty log state', () => {
    render(<SimulatorPage />);

    expect(screen.getByText(/no simulated events yet/i)).toBeInTheDocument();
  });

  it('adds a log when simulating an event', async () => {
    const user = userEvent.setup();

    render(<SimulatorPage />);

    await user.click(screen.getByRole('button', { name: /payment success/i }));

    expect(screen.getByText(/payment succeeded/i)).toBeInTheDocument();
  });

  it('clears logs when clear logs is clicked', async () => {
    const user = userEvent.setup();

    render(<SimulatorPage />);

    await user.click(screen.getByRole('button', { name: /payment success/i }));
    await user.click(screen.getByRole('button', { name: /clear logs/i }));

    expect(screen.getByText(/no simulated events yet/i)).toBeInTheDocument();
  });
});