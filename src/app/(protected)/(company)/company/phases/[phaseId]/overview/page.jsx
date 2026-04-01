export const metadata = { title: 'Phase Overview | Company' };

const COPY = {
  TITLE: 'Phase Overview',
  SUB: 'Dashboard statistics and key metrics for this internship phase.',
};

export default function PhaseOverviewPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">{COPY.TITLE}</h1>
      <p className="text-slate-500">{COPY.SUB}</p>
    </div>
  );
}
