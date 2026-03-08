import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Wallet, FlaskConical, Activity, X, ActivityIcon } from 'lucide-react';
import { useUIStore } from '../app/store/uiStore';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
  { label: 'Settlements', to: '/settlements', icon: Wallet },
  { label: 'Simulator', to: '/simulator', icon: FlaskConical },
  { label: 'Observability', to: '/observability', icon: Activity },
];

function Sidebar() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen w-65 flex-col border-r transition-transform duration-300
          lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
            < ActivityIcon size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--sidebar-text)' }}>
                iK Pulse
              </h1>
              <p className="text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>
                Merchant Ops
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 lg:hidden"
            style={{ color: 'var(--sidebar-text)' }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navItems.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                //   onClick={closeSidebar}
                  className={() =>
                    `flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                    color: 'var(--sidebar-text)',
                  })}
                >
                  {() => (
                    <>
                      <Icon size={18} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="border-t px-4 py-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="rounded-2xl border p-4"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--sidebar-text)' }}>
              Demo Merchant
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>
              nkanyison@ikpulse.co.za
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;