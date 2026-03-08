type DashboardSectionLoaderProps = {
  height?: string;
};

function DashboardSectionLoader({ height = '220px' }: DashboardSectionLoaderProps) {
  return (
    <div
      className="animate-pulse border p-6"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        minHeight: height,
      }}
    >
      <div
        className="mb-4 h-5 w-40 rounded"
        style={{ backgroundColor: 'var(--surface-muted)' }}
      />
      <div
        className="mb-3 h-10 w-28 rounded"
        style={{ backgroundColor: 'var(--surface-muted)' }}
      />
      <div
        className="h-4 w-56 rounded"
        style={{ backgroundColor: 'var(--surface-muted)' }}
      />
    </div>
  );
}

export default DashboardSectionLoader;