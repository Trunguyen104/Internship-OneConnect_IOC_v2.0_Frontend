'use client';

export default function InfoItem({ label, value, children, icon: Icon }) {
  return (
    <div className="group flex flex-col gap-1.5 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon size={14} className="text-primary/70 group-hover:text-primary transition-colors" />
        )}
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>

      <div className="min-h-[1.5rem]">
        {value && <p className="text-sm font-bold text-slate-700 md:text-base">{value}</p>}
        {children}
      </div>
    </div>
  );
}
