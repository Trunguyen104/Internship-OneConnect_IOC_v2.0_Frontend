export const metadata = { title: 'Settings | IOCv2 Admin' };

const COPY = {
  TITLE: 'Platform Settings',
  SUB: 'System configuration and preferences.',
};

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">{COPY.TITLE}</h1>
      <p className="text-slate-500">{COPY.SUB}</p>
    </div>
  );
}
