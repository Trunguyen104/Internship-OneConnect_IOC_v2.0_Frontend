'use client';

export function ProfileSectionCard({ title, icon, children, extra }) {
  return (
    <div className="h-full min-h-0 flex flex-col rounded-[32px] border border-gray-100 bg-surface shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-50 px-8 py-6">
        <div className="flex items-center gap-3">
          <span className="text-xl text-primary">{icon}</span>
          <h3 className="m-0 text-lg font-black tracking-tight text-text">{title}</h3>
        </div>
        {extra && <div>{extra}</div>}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-8">{children}</div>
    </div>
  );
}
