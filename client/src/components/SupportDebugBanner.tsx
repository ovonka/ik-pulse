import { ShieldCheck } from 'lucide-react';
import { useSupportDebugStore } from '../app/store/supportDebugStore';

function SupportDebugBanner() {
  const debugContext = useSupportDebugStore((state) => state.debugContext);

  if (!debugContext) {
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

          <div className="space-y-1">
            <p className="text-sm font-semibold">Active Support Debug Context</p>
            <p className="text-sm">
              Helping{' '}
              <span className="font-semibold">
                {debugContext.merchantContext.merchantName}
              </span>
            </p>
            <p className="text-sm">
              Requested by{' '}
              <span className="font-semibold">
                {debugContext.merchantContext.requestedByEmail ?? 'Unknown requester'}
              </span>
            </p>
            <p className="text-sm">
              Support code{' '}
              <span className="font-mono font-semibold">
                {debugContext.session.supportCode}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportDebugBanner;