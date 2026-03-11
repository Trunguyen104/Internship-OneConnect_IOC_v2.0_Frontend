export default function InfoItem({ label, value, children }) {
  return (
    <div>
      <p className='mb-1 text-sm font-medium text-slate-500'>{label}</p>

      {value && <p className='text-base font-semibold text-slate-900'>{value}</p>}

      {children}
    </div>
  );
}
