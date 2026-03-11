import { useEffect, useRef, useState } from 'react';

type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

type UsePollingQueryOptions<T> = {
  queryFn: () => Promise<T>;
  intervalMs?: number;
  enabled?: boolean;
};

export function usePollingQuery<T>({
  queryFn,
  intervalMs = 10000,
  enabled = true,
}: UsePollingQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<QueryStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  async function runQuery() {
    if (!enabled) return;

    setStatus((current) => (current === 'idle' ? 'loading' : current));
    setError(null);

    try {
      const result = await queryFn();

      if (!mountedRef.current) return;

      setData(result);
      setStatus('success');
    } catch (err) {
      if (!mountedRef.current) return;

      setStatus('error');
      setError(err instanceof Error ? err.message : 'Request failed');
    }
  }

  useEffect(() => {
    mountedRef.current = true;

    void runQuery();

    if (!enabled) {
      return () => {
        mountedRef.current = false;
      };
    }

    const timer = window.setInterval(() => {
      void runQuery();
    }, intervalMs);

    return () => {
      mountedRef.current = false;
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs]);

  return {
    data,
    status,
    error,
    refetch: runQuery,
  };
}