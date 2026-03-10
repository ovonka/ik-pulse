import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import TransactionsPage from '../../pages/TransactionsPage';
import SettlementsPage from '../../pages/SettlementsPage';
import SimulatorPage from '../../pages/SimulatorPage';
import ObservabilityPage from '../../pages/ObservabilityPage';
import NotFoundPage from '../../pages/NotFoundPage';
import InternalSupportSessionPage from '../../pages/InternalSupportSessionPage';
import SupportAccessPage from '../../pages/SupportAccessPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

     <Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/transactions" element={<TransactionsPage />} />
    <Route path="/settlements" element={<SettlementsPage />} />

    <Route element={<RoleRoute allowedRoles={['merchant']} />}>
      <Route path="/support-access" element={<SupportAccessPage />} />
    </Route>

    <Route element={<RoleRoute allowedRoles={['admin', 'support', 'qa']} />}>
      <Route path="/internal-support-session" element={<InternalSupportSessionPage />} />
      <Route path="/simulator" element={<SimulatorPage />} />
      <Route path="/observability" element={<ObservabilityPage />} />
    </Route>
  </Route>
</Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;