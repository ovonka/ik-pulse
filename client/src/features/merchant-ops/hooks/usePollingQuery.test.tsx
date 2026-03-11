import { renderHook, waitFor } from '@testing-library/react';
import { usePollingQuery } from './usePollingQuery';

describe('usePollingQuery', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('runs the query immediately', async () => {
    const queryFn = vi.fn().mockResolvedValue({ value: 1 });

    const { result } = renderHook(() =>
      usePollingQuery({
        queryFn,
        intervalMs: 1000,
      })
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: 1 });
    });

    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('reruns when deps change', async () => {
    const queryFn = vi.fn().mockResolvedValue({ value: 'ok' });

    const { rerender } = renderHook(
      ({ page }) =>
        usePollingQuery({
          queryFn,
          intervalMs: 1000,
          deps: [page],
        }),
      {
        initialProps: { page: 1 },
      }
    );

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    rerender({ page: 2 });

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });
});