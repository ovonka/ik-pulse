import { useState } from 'react';
import { useSupportDebugStore } from '../app/store/supportDebugStore';
import { useToastStore } from '../app/store/toastStore';

function InternalSupportSessionPage() {
  const [resolutionNote, setResolutionNote] = useState('');

  const debugContext = useSupportDebugStore((state) => state.debugContext);
  const resolveSupportSession = useSupportDebugStore((state) => state.resolveSupportSession);
  const showToast = useToastStore((state) => state.showToast);

  if (!debugContext) {
    return (
      <div
        className="rounded-xl border px-4 py-6 text-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        No active support session loaded.
      </div>
    );
  }

  async function handleResolve() {
  const trimmedNote = resolutionNote.trim();
  const canResolve = trimmedNote.length >= 5;

  if (!canResolve) {
    showToast({
      type: 'error',
      title: 'Resolution note required',
      message: 'Please enter at least 5 characters before resolving the session.',
    });
    return;
  }

  try {
    await resolveSupportSession(trimmedNote);

    showToast({
      type: 'success',
      title: 'Support session resolved',
      message: 'The merchant support request has been marked as resolved.',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to resolve support session';

    showToast({
      type: 'error',
      title: 'Resolution failed',
      message,
    });
  }
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
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
          Resolve Support Session
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Merchant
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {debugContext.merchantContext.merchantName}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Requested By
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {debugContext.merchantContext.requestedByEmail ?? 'Unknown requester'}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Support Code
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {debugContext.session.supportCode}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Original Reason
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {debugContext.session.reason}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="resolution-note"
            className="mb-2 block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Resolution Note
          </label>

          <textarea
            id="resolution-note"
            rows={5}
            value={resolutionNote}
            onChange={(event) => setResolutionNote(event.target.value)}
            placeholder="Describe what was checked, fixed, or communicated to the merchant..."
            className="w-full resize-none border px-4 py-3 outline-none"
            style={{
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleResolve}
            disabled={!(resolutionNote.trim().length >= 5)}
            className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
            }}
          >
            Resolve Support Session
          </button>
        </div>
      </article>
    </section>
  );
}

export default InternalSupportSessionPage;