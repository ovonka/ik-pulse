import { ShieldCheck } from 'lucide-react';
import { useSupportDebugStore } from '../app/store/supportDebugStore';
import { useAuthStore } from '../app/store/authStore';

function SupportDebugBanner() {
  const debugContext = useSupportDebugStore((state) => state.debugContext);
  const user = useAuthStore((state) => state.user);

  const isInternalUser =
    user?.role === 'admin' || user?.role === 'support' || user?.role === 'qa';

  if (!isInternalUser || !debugContext) {
    return null;
  }

  return (
    <div
      className="mx-4 mt-4 rounded-xl border px-4 py-4 md:mx-6"
      style={{
        backgroundColor: 'var(--warning-soft)',
        borderColor: 'var(--warning)',
        color: 'var(--text)',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <ShieldCheck size={18} style={{ color: 'var(--warning)' }} />
          </div>

          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Active Troubleshoot
            </p>

            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Debugging for merchant:{' '}
              <span className="font-medium">{debugContext.merchantContext.merchantName}</span>
            </p>

            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Requested by:{' '}
              <span className="font-medium">
                {debugContext.merchantContext.requestedByEmail ?? 'Unknown requester'}
              </span>
            </p>

            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Support code:{' '}
              <span className="font-medium">{debugContext.session.supportCode}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportDebugBanner;