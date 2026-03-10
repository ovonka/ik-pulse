import { create } from 'zustand';
import type { SupportDebugContext } from '../../features/auth/types/supportDebug.types';
import { consumeSupportCodeRequest } from '../../features/auth/api/supportDebugApi';
import { useAuthStore } from './authStore';

const STORAGE_KEY = 'ikpulse-support-debug-context';

function getStoredDebugContext(): SupportDebugContext | null {
  const value = localStorage.getItem(STORAGE_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as SupportDebugContext;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function setStoredDebugContext(value: SupportDebugContext | null) {
  if (!value) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

type SupportDebugState = {
  debugContext: SupportDebugContext | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  consumeSupportCode: (supportCode: string) => Promise<SupportDebugContext>;
  clearDebugContext: () => void;
  clearError: () => void;
};

export const useSupportDebugStore = create<SupportDebugState>((set) => ({
  debugContext: getStoredDebugContext(),
  status: 'idle',
  error: null,

  consumeSupportCode: async (supportCode: string) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw new Error('Missing access token');
    }

    set({ status: 'loading', error: null });

    try {
      const result = await consumeSupportCodeRequest(accessToken, { supportCode });

      setStoredDebugContext(result);

      set({
        debugContext: result,
        status: 'success',
        error: null,
      });

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to consume support code';

      set({
        status: 'error',
        error: message,
      });

      throw error;
    }
  },

  clearDebugContext: () => {
    setStoredDebugContext(null);

    set({
      debugContext: null,
      status: 'idle',
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));