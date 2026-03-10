import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './TopBar';
import SupportDebugBanner from './SupportDebugBanner';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard Overview',
    subtitle: 'Real-time merchant operations and payment insights',
  },
  '/transactions': {
    title: 'Transactions',
    subtitle: 'Review and manage merchant payment activity',
  },
  '/settlements': {
    title: 'Settlements',
    subtitle: 'Track upcoming and completed payouts',
  },
  '/simulator': {
    title: 'Event Simulator',
    subtitle: 'Simulate payment events and webhook flows',
  },
  '/observability': {
    title: 'Observability',
    subtitle: 'Logs, metrics and system health signals',
  },
};

function AppLayout() {
  const location = useLocation();
  const meta =
    pageMeta[location.pathname] ?? {
      title: 'iK Pulse',
      subtitle: 'Merchant operations dashboard',
    };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />

      <div className="lg:pl-65">
        <Topbar title={meta.title} subtitle={meta.subtitle} />

        <SupportDebugBanner />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;