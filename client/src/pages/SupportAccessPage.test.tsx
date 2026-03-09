import { render, screen } from '@testing-library/react';
import SupportAccessPage from './SupportAccessPage';

describe('SupportAccessPage', () => {
  it('renders the support access workflow', () => {
    render(<SupportAccessPage />);

    expect(screen.getByText(/temporary support access/i)).toBeInTheDocument();
    expect(screen.getByText(/current support session/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate support code/i })).toBeInTheDocument();
  });
});