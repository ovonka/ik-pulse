import { act, renderHook, waitFor } from '@testing-library/react';
import { usePollingQuery } from './usePollingQuery';

describe('usePollingQuery', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('runs the query immediately and on interval', async () => {
    const queryFn = vi
      .fn()
      .mockResolvedValueOnce({ value: 1 })
      .mockResolvedValueOnce({ value: 2 });

    const { result } = renderHook(() =>
      usePollingQuery({
        queryFn,
        intervalMs: 1000,
      })
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: 1 });
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2);
    });
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