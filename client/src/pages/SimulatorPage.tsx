import SimulatorActionsCard from '../components/simulator/SimulatorActionsCard';
import SimulatorStatsCard from '../components/simulator/SimulatorStatsCard';
import EventLogStream from '../components/simulator/EventLogStream';
import { useSimulatorState } from '../features/simulator/hooks/useSimulatorState';

function SimulatorPage() {
  const { logs, stats, simulateEvent, clearLogs } = useSimulatorState();

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_2fr]">
      <div className="space-y-6">
        <SimulatorActionsCard onSimulate={simulateEvent} />
        <SimulatorStatsCard stats={stats} />
      </div>

      <EventLogStream logs={logs} onClearLogs={clearLogs} />
    </section>
  );
}

export default SimulatorPage;