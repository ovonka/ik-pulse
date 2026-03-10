import { create } from 'zustand';
import type {
  CreateSupportAccessPayload,
  SupportAccessSession,
} from '../../features/auth/types/supportAcces.types';
import {
  createSupportSessionRequest,
  getCurrentSupportSessionRequest,
  revokeSupportSessionRequest,
} from '../../features/auth/api/supportAccessApi';
import { useAuthStore } from './authStore';

type SupportAccessStatus = 'idle' | 'loading' | 'success' | 'error';

type SupportAccessState = {
  activeSession: SupportAccessSession | null;
  status: SupportAccessStatus;
  error: string | null;

  fetchCurrentSession: () => Promise<void>;
  generateCode: (payload: CreateSupportAccessPayload) => Promise<SupportAccessSession>;
  revokeCode: () => Promise<SupportAccessSession | null>;
  clearError: () => void;
};

export const useSupportAccessStore = create<SupportAccessState>((set) => ({
  activeSession: null,
  status: 'idle',
  error: null,

  fetchCurrentSession: async () => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      return;
    }

    set({ status: 'loading', error: null });

    try {
      const session = await getCurrentSupportSessionRequest(accessToken);

      set({
        activeSession: session,
        status: 'success',
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch support session';

      set({
        activeSession: null,
        status: 'error',
        error: message,
      });
    }
  },

  generateCode: async (payload) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw new Error('Missing access token');
    }

    set({ status: 'loading', error: null });

    try {
      const session = await createSupportSessionRequest(accessToken, payload);

      set({
        activeSession: session,
        status: 'success',
        error: null,
      });

      return session;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create support session';

      set({
        status: 'error',
        error: message,
      });

      throw error;
    }
  },

  revokeCode: async () => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw new Error('Missing access token');
    }

    set({ status: 'loading', error: null });

    try {
      const session = await revokeSupportSessionRequest(accessToken);

      set({
        activeSession: session,
        status: 'success',
        error: null,
      });

      return session;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to revoke support session';

      set({
        status: 'error',
        error: message,
      });

      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));