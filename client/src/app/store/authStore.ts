import { create } from 'zustand';
import type { AuthUser, LoginPayload } from '../../features/auth/types/auth.types';
import { loginRequest, meRequest } from '../../features/auth/api/authApi';
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from '../../features/auth/utils/authStorage';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
  error: string | null;

  login: (payload: LoginPayload) => Promise<AuthUser>;
  bootstrap: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: getStoredAccessToken(),
  status: 'idle',
  error: null,

  login: async (payload) => {
    set({ status: 'loading', error: null });

    try {
      const response = await loginRequest(payload);

      setStoredAccessToken(response.accessToken);

      set({
        user: response.user,
        accessToken: response.accessToken,
        status: 'authenticated',
        error: null,
      });

      return response.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';

      clearStoredAccessToken();

      set({
        user: null,
        accessToken: null,
        status: 'unauthenticated',
        error: message,
      });

      throw error;
    }
  },

  bootstrap: async () => {
    const token = getStoredAccessToken();

    if (!token) {
      set({
        user: null,
        accessToken: null,
        status: 'unauthenticated',
        error: null,
      });
      return;
    }

    set({ status: 'loading', error: null, accessToken: token });

    try {
      const response = await meRequest(token);

      set({
        user: response.user,
        accessToken: token,
        status: 'authenticated',
        error: null,
      });
    } catch {
      clearStoredAccessToken();

      set({
        user: null,
        accessToken: null,
        status: 'unauthenticated',
        error: null,
      });
    }
  },

  logout: () => {
    clearStoredAccessToken();

    set({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));