import { create } from 'zustand';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type ToastItem = {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  isClosing: boolean;
};

type ToastState = {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id' | 'isClosing'>) => void;
  removeToast: (id: string) => void;
  startClosingToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (toast) => {
    const id = crypto.randomUUID();

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, isClosing: false }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.map((item) =>
          item.id === id ? { ...item, isClosing: true } : item
        ),
      }));

      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((item) => item.id !== id),
        }));
      }, 220);
    }, 3200);
  },

  startClosingToast: (id) =>
    set((state) => ({
      toasts: state.toasts.map((item) =>
        item.id === id ? { ...item, isClosing: true } : item
      ),
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    })),
}));