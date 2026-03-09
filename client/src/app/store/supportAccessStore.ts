import { create } from 'zustand';
import type { SupportAccessSession } from '../../features/auth/types/supportAccess.types';

type SupportAccessState = {
  activeSession: SupportAccessSession | null;
  generateCode: (reason: string) => SupportAccessSession;
  revokeCode: () => void;
};

function createSupportCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createExpiryDate(minutes: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export const useSupportAccessStore = create<SupportAccessState>((set) => ({
  activeSession: null,

  generateCode: (reason: string) => {
    const session: SupportAccessSession = {
      code: createSupportCode(),
      status: 'active',
      expiresAt: createExpiryDate(30),
      reason,
    };

    set({ activeSession: session });
    return session;
  },

  revokeCode: () =>
    set((state) => ({
      activeSession: state.activeSession
        ? {
            ...state.activeSession,
            status: 'revoked',
          }
        : null,
    })),
}));