import { render, screen } from '@testing-library/react';
import SettlementsPage from './SettlementsPage';

describe('SettlementsPage', () => {
  it('renders settlement page sections', () => {
    render(<SettlementsPage />);

    expect(screen.getByText(/total settled \(last 7d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/pending settlement/i)).toBeInTheDocument();
    expect(screen.getByText(/avg settlement time/i)).toBeInTheDocument();
    expect(screen.getByText(/settlement accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/next settlement/i)).toBeInTheDocument();
    expect(screen.getByText(/settlement history/i)).toBeInTheDocument();
  });
});