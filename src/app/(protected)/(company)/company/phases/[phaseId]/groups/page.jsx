export const metadata = { title: 'Groups | Phase Workspace' };

const COPY = {
  TITLE: 'Internship Groups',
  SUB: 'All internship groups within this phase.',
};

export default function PhaseGroupsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">{COPY.TITLE}</h1>
      <p className="text-slate-500">{COPY.SUB}</p>
    </div>
  );
}
