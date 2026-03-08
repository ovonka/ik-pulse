import type { NextSettlement } from '../../features/settlements/types/settlements.types';
import SettlementStatusBadge from './SettlementStatusBadge';

type NextSettlementCardProps = {
  settlement: NextSettlement;
};

function NextSettlementCard({ settlement }: NextSettlementCardProps) {
  return (
    <section
      className="border px-6 py-6"
      style={{
        backgroundColor: 'var(--success-soft)',
        borderColor: 'color-mix(in srgb, var(--success) 30%, var(--border))',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
            Next Settlement
          </h2>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            {settlement.scheduledFor}
          </p>
        </div>

        <SettlementStatusBadge status={settlement.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Gross Amount
          </p>
          <p className="mt-2 text-4xl font-semibold" style={{ color: 'var(--text)' }}>
            R{settlement.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Transaction Count
          </p>
          <p className="mt-2 text-4xl font-semibold" style={{ color: 'var(--text)' }}>
            {settlement.transactionCount}
          </p>
        </div>

        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Estimated Fees
          </p>
          <p className="mt-2 text-4xl font-semibold" style={{ color: 'var(--danger)' }}>
            -R{settlement.estimatedFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Net Settlement
          </p>
          <p className="mt-2 text-4xl font-semibold" style={{ color: 'var(--success)' }}>
            R{settlement.netSettlement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </section>
  );
}

export default NextSettlementCard;