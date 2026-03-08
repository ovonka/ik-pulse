import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useToastStore } from '../../app/store/toastStore';

const iconMap = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-100 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 border px-4 py-4 shadow-lg"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="mt-0.5">
              <Icon
                size={20}
                style={{
                  color:
                    toast.type === 'success'
                      ? 'var(--success)'
                      : toast.type === 'error'
                        ? 'var(--danger)'
                        : toast.type === 'warning'
                          ? 'var(--warning)'
                          : 'var(--info)',
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {toast.title}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="cursor-pointer rounded-lg p-1 transition hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;