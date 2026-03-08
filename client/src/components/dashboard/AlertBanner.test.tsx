import { render, screen } from '@testing-library/react';
import AlertBanner from './AlertBanner';

describe('AlertBanner', () => {
  it('renders title and message', () => {
    render(
      <AlertBanner
        title="High Failure Rate Detected"
        message="Transaction failure rate is above 2.5% in the last hour."
      />
    );

    expect(screen.getByText(/high failure rate detected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/transaction failure rate is above 2.5% in the last hour/i)
    ).toBeInTheDocument();
  });
});