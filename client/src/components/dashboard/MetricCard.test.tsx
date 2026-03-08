import { render, screen } from '@testing-library/react';
import { Wallet } from 'lucide-react';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  it('renders metric title, value and subtitle', () => {
    render(
      <MetricCard
        title="Next Settlement"
        value="R38,245"
        subtitle="Expected: Tomorrow 9 AM"
        icon={Wallet}
      />
    );

    expect(screen.getByText(/next settlement/i)).toBeInTheDocument();
    expect(screen.getByText(/R38,245/i)).toBeInTheDocument();
    expect(screen.getByText(/expected: tomorrow 9 am/i)).toBeInTheDocument();
  });
});