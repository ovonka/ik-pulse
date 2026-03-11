import { CalendarDays, Wallet } from 'lucide-react';
import type { SettlementItem } from '../../features/merchant-ops/types/merchantOps.types';
import { formatZar } from '../../features/merchant-ops/utils/formatCurrency';

type NextSettlementCardProps = {
  settlement: SettlementItem | null;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function NextSettlementCard({ settlement }: NextSettlementCardProps) {
  return (
    <section
      className="border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--warning-soft)' }}
        >
          <Wallet size={22} style={{ color: 'var(--warning)' }} />
        </div>

        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Next Settlement
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Upcoming payout details
          </p>
        </div>
      </div>

      {settlement ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Provider
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {settlement.provider}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Net Amount
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {formatZar(settlement.netAmount)}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Scheduled For
            </p>
            <p className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>
              {formatDateTime(settlement.scheduledFor)}
            </p>
          </div>

          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Status
            </p>
            <p className="mt-1 font-semibold capitalize" style={{ color: 'var(--text)' }}>
              {settlement.status}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl border px-4 py-6 text-sm"
          style={{
            backgroundColor: 'var(--surface-muted)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          No upcoming settlement found.
        </div>
      )}
    </section>
  );
}

export default NextSettlementCard;