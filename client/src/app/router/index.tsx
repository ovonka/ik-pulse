import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import TransactionsPage from '../../pages/TransactionsPage';
import SettlementsPage from '../../pages/SettlementsPage';
import SimulatorPage from '../../pages/SimulatorPage';
import ObservabilityPage from '../../pages/ObservabilityPage';
import NotFoundPage from '../../pages/NotFoundPage';
import AppLayout from '../../components/AppLayout';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/settlements" element={<SettlementsPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/observability" element={<ObservabilityPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;