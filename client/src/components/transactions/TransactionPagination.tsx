import { ChevronLeft, ChevronRight } from 'lucide-react';

type TransactionPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

function TransactionPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: TransactionPaginationProps) {
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div
      className="flex flex-col gap-4 border px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: 'var(--border)' }}
    >
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default TransactionPagination;