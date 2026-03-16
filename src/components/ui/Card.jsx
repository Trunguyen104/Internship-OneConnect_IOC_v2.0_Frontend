export default function Card({ children, className = '' }) {
  return (
    <div className={`flex min-h-[420px] flex-col rounded-2xl bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
