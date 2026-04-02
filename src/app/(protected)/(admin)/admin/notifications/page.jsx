import { Bell, CheckCheck, Filter, Search } from 'lucide-react';

export const metadata = { title: 'Notifications | IOCv2 Admin' };

const COPY = {
  PAGE_TITLE: 'Notifications',
  PAGE_SUB: 'Stay up to date with platform events and alerts.',
  MARK_ALL: 'Mark all read',
  FILTER: 'Filter',
  UNREAD_PREFIX: 'Unread (',
  CLOSE_PAREN: ')',
};

const notifications = [
  {
    id: 1,
    title: 'FPT University registered successfully',
    body: 'A new university partner has been onboarded. Review their profile for approval.',
    time: '2 hours ago',
    read: false,
    tag: 'University',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    id: 2,
    title: 'TechCorp Nova enterprise account activated',
    body: 'Enterprise partner account has been activated and is ready for internship postings.',
    time: '4 hours ago',
    read: false,
    tag: 'Enterprise',
    tagColor: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    id: 3,
    title: 'System maintenance scheduled',
    body: 'Scheduled maintenance on April 5th from 02:00 to 04:00 AM UTC.',
    time: '1 day ago',
    read: true,
    tag: 'System',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    id: 4,
    title: 'Monthly report available',
    body: 'Q1 2025 internship statistics report has been generated and is ready for download.',
    time: '2 days ago',
    read: true,
    tag: 'Report',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">{COPY.PAGE_TITLE}</h1>
        <p className="text-sm text-slate-500">{COPY.PAGE_SUB}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search notifications..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-600 transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
                <CheckCheck className="h-3.5 w-3.5" />
                {COPY.MARK_ALL}
              </button>
            )}
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-600 transition-all hover:bg-gray-50">
              <Filter className="h-3.5 w-3.5" />
              {COPY.FILTER}
            </button>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">
              {COPY.UNREAD_PREFIX}
              {unreadCount}
              {COPY.CLOSE_PAREN}
            </span>
            <div className="h-px flex-1 bg-primary/10" />
          </div>
        )}

        <div className="flex flex-col divide-y divide-gray-50">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`group -mx-8 flex items-start gap-4 px-8 py-4 transition-colors first:pt-0 hover:bg-gray-50/50 ${
                !notif.read ? 'bg-primary/[0.02]' : ''
              }`}
            >
              <div className="mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                {!notif.read ? (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                ) : (
                  <Bell className="h-3.5 w-3.5 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${notif.tagColor}`}
                  >
                    {notif.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{notif.time}</span>
                </div>
                <p
                  className={`text-[14px] font-bold leading-snug transition-colors group-hover:text-primary ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}
                >
                  {notif.title}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-400">
                  {notif.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
