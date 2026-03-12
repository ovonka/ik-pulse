import { fireEvent, render, screen } from '@testing-library/react';
import DashboardCharts from './DashboardCharts';

describe('DashboardCharts', () => {
  const volumeSeries = [
    {
      label: '01 Mar',
      successfulAmount: 1200,
      failedAmount: 200,
      pendingAmount: 100,
      successfulCount: 12,
      failedCount: 2,
      pendingCount: 1,
    },
    {
      label: '02 Mar',
      successfulAmount: 2400,
      failedAmount: 100,
      pendingAmount: 50,
      successfulCount: 20,
      failedCount: 1,
      pendingCount: 1,
    },
    {
      label: '03 Mar',
      successfulAmount: 1800,
      failedAmount: 300,
      pendingAmount: 120,
      successfulCount: 16,
      failedCount: 3,
      pendingCount: 2,
    },
  ];

  const statusBreakdown = {
    success: 48,
    failed: 6,
    pending: 4,
  };

  it('renders chart section headings and range buttons', () => {
    render(
      <DashboardCharts
        chartRange="7d"
        onChartRangeChange={vi.fn()}
        volumeSeries={volumeSeries}
        statusBreakdown={statusBreakdown}
      />
    );

    expect(
      screen.getByRole('heading', { name: /transaction volume/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /status breakdown/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '1D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '14D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30D' })).toBeInTheDocument();
  });

  it('calls onChartRangeChange when a range button is clicked', () => {
    const onChartRangeChange = vi.fn();

    render(
      <DashboardCharts
        chartRange="7d"
        onChartRangeChange={onChartRangeChange}
        volumeSeries={volumeSeries}
        statusBreakdown={statusBreakdown}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '3D' }));

    expect(onChartRangeChange).toHaveBeenCalledWith('3d');
  });

  it('renders pie legend values from status breakdown', () => {
    render(
      <DashboardCharts
        chartRange="7d"
        onChartRangeChange={vi.fn()}
        volumeSeries={volumeSeries}
        statusBreakdown={statusBreakdown}
      />
    );

    expect(screen.getByText('Successful')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();

    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});