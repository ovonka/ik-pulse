import { AlertTriangle, X } from 'lucide-react';

type AlertBannerProps = {
  title: string;
  message: string;
  onDismiss?: () => void;
};

function AlertBanner({ title, message, onDismiss }: AlertBannerProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 border px-5 py-4"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
            {title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--danger)' }}>
            {message}
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Dismiss alert"
        className="rounded-lg p-1 transition hover:opacity-80"
        style={{ color: 'var(--text-muted)' }}
        onClick={onDismiss}
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default AlertBanner;