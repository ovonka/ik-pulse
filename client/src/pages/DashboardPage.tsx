function DashboardPage() {
  return (
    <section className="space-y-6">
      <div
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <h2 className="text-lg font-semibold">Dashboard content goes here</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          i'll build the KPI cards and charts next.
        </p>
      </div>
    </section>
  );
}

export default DashboardPage;