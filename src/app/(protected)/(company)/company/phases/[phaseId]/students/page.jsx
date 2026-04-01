export const metadata = { title: 'Students | Phase Workspace' };

const COPY = {
  TITLE: 'Students',
  SUB: 'All students participating in this internship phase.',
};

export default function PhaseStudentsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">{COPY.TITLE}</h1>
      <p className="text-slate-500">{COPY.SUB}</p>
    </div>
  );
}
