import Badge from '@/components/shared/Badge';
import Stepper from '@/components/shared/Stepper';

export function CompletedCycles({ completedCycles }) {
  if (!completedCycles || completedCycles.length === 0) return null;

  return completedCycles.map((cycle, i) => (
    <div key={cycle.cycleId || i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">HISTORICAL TERM</span>
          <h3 className="text-2xl font-bold text-gray-800">{cycle.cycleName || 'Summer 2024 Semester'}</h3>
        </div>
        <Badge variant="default" size="lg" className="rounded-md font-bold px-4">
          COMPLETED
        </Badge>
      </div>

      <div className="px-4 py-6">
        {/* Uses Stepper indicating terminal state with all completed */}
        <Stepper currentStatus="Completed" isTerminalStatus={true} />
      </div>
    </div>
  ));
}
