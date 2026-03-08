import { useState } from 'react';
import type { ObservabilityRange } from '../types/observability.types';

export function useObservabilityState() {
  const [range, setRange] = useState<ObservabilityRange>('24h');

  return {
    range,
    setRange,
  };
}