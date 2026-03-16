import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../../app/store/authStore';

export function useAuthBootstrap() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const hasBootstrappedRef = useRef(false);

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;
    void bootstrap();
  }, [bootstrap]);
}