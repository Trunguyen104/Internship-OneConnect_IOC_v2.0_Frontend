export default function InfoItem({ label, value, children }) {
  return (
    <div>
      <p className="text-muted mb-1 text-sm font-medium">{label}</p>

      {value && <p className="text-text text-base font-semibold">{value}</p>}

      {children}
    </div>
  );
}
