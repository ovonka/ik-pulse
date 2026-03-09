import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  FlaskConical,
  Activity,
  X,
  ActivityIcon,
  LogOut,
  ShieldBanIcon,
} from 'lucide-react';
import { useUIStore } from '../app/store/uiStore';
import { useAuthStore } from '../app/store/authStore';
import type { UserRole } from '../features/auth/types/auth.types';

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    roles: ['merchant', 'admin', 'support', 'qa'],
  },
  {
    label: 'Transactions',
    to: '/transactions',
    icon: ArrowLeftRight,
    roles: ['merchant', 'admin', 'support', 'qa'],
  },
  {
    label: 'Settlements',
    to: '/settlements',
    icon: Wallet,
    roles: ['merchant', 'admin', 'support', 'qa'],
  },
  {
    label: 'Simulator',
    to: '/simulator',
    icon: FlaskConical,
    roles: ['admin', 'support', 'qa'],
  },
  {
    label: 'Observability',
    to: '/observability',
    icon: Activity,
    roles: ['admin', 'support', 'qa'],
    
  },
  {
  label: 'Support Access',
  to: '/support-access',
  icon: ShieldBanIcon,
  roles: ['merchant'],
},
];

function formatRole(role: UserRole) {
  if (role === 'qa') return 'QA';
  if (role === 'admin') return 'Admin';
  if (role === 'support') return 'Support';
  return 'Merchant';
}

function Sidebar() {
  const navigate = useNavigate();

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const visibleNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  function handleLogout() {
    logout();
    closeSidebar();
    navigate('/login', { replace: true });
  }

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
              <ActivityIcon size={18} />
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
            {visibleNavItems.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                    color: 'var(--sidebar-text)',
                  })}
                >
                  <Icon size={18} />
                  <span>{label}</span>
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
              {user ? formatRole(user.role) : 'Guest'}
            </p>

            <p className="mt-1 text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>
              {user?.email ?? 'No active session'}
            </p>

            {user?.merchantId ? (
              <p className="mt-2 text-[11px]" style={{ color: 'var(--sidebar-text-muted)' }}>
                Merchant scope active
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-85"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'var(--sidebar-text)',
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;