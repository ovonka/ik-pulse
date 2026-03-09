import { useMemo, useState } from 'react';
import { Copy, ShieldCheck, Ban } from 'lucide-react';
import { useSupportAccessStore } from '../app/store/supportAccessStore';
import { useToastStore } from '../app/store/toastStore';

function formatExpiry(isoDate: string) {
  return new Date(isoDate).toLocaleString();
}

function SupportAccessPage() {
  const [reason, setReason] = useState('');
  const activeSession = useSupportAccessStore((state) => state.activeSession);
  const generateCode = useSupportAccessStore((state) => state.generateCode);
  const revokeCode = useSupportAccessStore((state) => state.revokeCode);
  const showToast = useToastStore((state) => state.showToast);

  const isActive = activeSession?.status === 'active';

  const helperText = useMemo(() => {
    if (!activeSession) {
      return 'Generate a temporary support code for the debug team. The code is scoped and time-limited.';
    }

    if (activeSession.status === 'revoked') {
      return 'The previous support code has been revoked. Generate a new one if support still needs access.';
    }

    return 'A temporary support code is active. Share it only with your verified support or admin contact.';
  }, [activeSession]);

  function handleGenerateCode() {
    const session = generateCode(reason.trim() || 'Merchant requested troubleshooting assistance');

    showToast({
      type: 'success',
      title: 'Support code generated',
      message: `Code ${session.code} is active until ${formatExpiry(session.expiresAt)}`,
    });
  }

  async function handleCopyCode() {
    if (!activeSession?.code) return;

    await navigator.clipboard.writeText(activeSession.code);

    showToast({
      type: 'info',
      title: 'Support code copied',
      message: `${activeSession.code} copied to clipboard`,
    });
  }

  function handleRevokeCode() {
    revokeCode();

    showToast({
      type: 'warning',
      title: 'Support code revoked',
      message: 'The active support session has been revoked.',
    });
  }

  return (
    <section className="space-y-6">
      <article
        className="border p-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="mb-6 flex items-start gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'var(--success-soft)' }}
          >
            <ShieldCheck size={22} style={{ color: 'var(--success)' }} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              Temporary Support Access
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              {helperText}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="support-reason"
              className="mb-2 block text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Reason for support access
            </label>
            <textarea
              id="support-reason"
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Describe the issue support should investigate..."
              className="w-full resize-none border px-4 py-3 outline-none"
              style={{
                backgroundColor: 'var(--surface-muted)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateCode}
              className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#fff',
              }}
            >
              Generate Support Code
            </button>

            {isActive ? (
              <button
                type="button"
                onClick={handleRevokeCode}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:opacity-90"
                style={{
                  borderColor: 'var(--danger)',
                  color: 'var(--danger)',
                  backgroundColor: 'var(--danger-soft)',
                }}
              >
                <Ban size={16} />
                Revoke Code
              </button>
            ) : null}
          </div>
        </div>
      </article>

      <article
        className="border p-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
          Current Support Session
        </h3>

        {activeSession ? (
          <div className="mt-5 space-y-4">
            <div
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-4"
              style={{
                backgroundColor: 'var(--surface-muted)',
                borderColor: 'var(--border)',
              }}
            >
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Support Code
                </p>
                <p className="mt-1 text-2xl font-bold tracking-widest" style={{ color: 'var(--text)' }}>
                  {activeSession.code}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-90"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <Copy size={16} />
                Copy code
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Status
                </p>
                <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
                  {activeSession.status}
                </p>
              </div>

              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Expires At
                </p>
                <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
                  {formatExpiry(activeSession.expiresAt)}
                </p>
              </div>

              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Reason
                </p>
                <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
                  {activeSession.reason}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mt-5 rounded-xl border px-4 py-6 text-sm"
            style={{
              backgroundColor: 'var(--surface-muted)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            No active support access code yet.
          </div>
        )}
      </article>
    </section>
  );
}

export default SupportAccessPage;