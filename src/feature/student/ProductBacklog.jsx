// src/feature/student/ProductBacklog.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { productBacklogService } from '@/services/productbacklog.service';
import CreateTaskModal from '@/shared/components/CreateTaskModal';
import CreateEpicModal from '@/shared/components/CreateEpicModal';
import MoreMenuButton from '@/shared/components/MoreMenuButton';

function Avatar({ name = '', avatar }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  return (
    <div className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-bg'>
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt={name} className='h-full w-full object-cover' />
      ) : (
        <span className='text-sm font-semibold text-muted'>{initial}</span>
      )}
    </div>
  );
}

function Badge({ children, tone = 'default', className = '' }) {
  const map = {
    default: 'bg-bg text-foreground border-border/60',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-primary/10 text-primary border-primary/20',
    purple: 'bg-[#F3F0FF] text-[#6D28D9] border-[#E9D5FF]',
  };

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        map[tone] || map.default,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

const statusTone = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  IN_REVIEW: 'warning',
  DONE: 'success',
};

const priorityTone = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
};

export default function ProductBacklog() {
  const [data, setData] = useState({ epics: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [selectedEpicId, setSelectedEpicId] = useState('');
  const [search, setSearch] = useState('');
  const [openCreateEpic, setOpenCreateEpic] = useState(false);
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);

        let res;
        const hasApi = !!process.env.NEXT_PUBLIC_API_URL;

        if (hasApi) {
          res = await productBacklogService.getAll();
        } else {
          res = (await import('@/mocks/data/productbacklog.mock.json')).default;
        }

        if (!mounted) return;
        setData(res);
        setSelectedEpicId(res.epics?.[0]?.id || '');
      } catch {
        // fallback mock nếu API fail
        try {
          const mock = (await import('@/mocks/data/productbacklog.mock.json')).default;
          if (!mounted) return;
          setData(mock);
          setSelectedEpicId(mock.epics?.[0]?.id || '');
        } catch {
          // ignore
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const items = data.items || [];
    const s = search.trim().toLowerCase();
    return items
      .filter((it) => (selectedEpicId ? it.epicId === selectedEpicId : true))
      .filter((it) => {
        if (!s) return true;
        return (
          it.title?.toLowerCase().includes(s) ||
          it.description?.toLowerCase().includes(s) ||
          it.type?.toLowerCase().includes(s)
        );
      });
  }, [data.items, selectedEpicId, search]);

  const epics = data.epics || [];

  return (
    <div className='w-full space-y-4'>
      {/* Toolbar */}
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='text-xl font-semibold'>Product Backlog</div>

        <div className='flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end'>
          <div className='relative md:w-[420px]'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='h-10 w-full rounded-full border border-border/60 bg-surface px-4 pr-10 text-sm outline-none focus:border-primary/40'
              placeholder='Tìm kiếm backlog…'
            />
            <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted'>
              ⌕
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setOpenCreateEpic(true)}
              className={[
                'inline-flex items-center gap-3',
                'h-10 px-6 rounded-full',
                'text-white',
                'text-base font-semibold',
                'shadow-sm transition-colors',

                // ✅ dùng đúng token global, khỏi phụ thuộc tailwind theme
                'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]',
              ].join(' ')}
            >
              <span>Create Epic</span>

              <span className='flex items-center justify-center h-5 w-5 rounded-full border-2 border-white text-white text-xl leading-none'>
                +
              </span>
            </button>

            <button
              type='button'
              onClick={() => setOpenCreateTask(true)}
              className={[
                'inline-flex items-center gap-3',
                'h-10 px-6 rounded-full',
                'text-white',
                'text-base font-semibold',
                'shadow-sm transition-colors',
                'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]',
              ].join(' ')}
            >
              <span>Create User Story</span>
              <span className='flex items-center justify-center h-5 w-5 rounded-full border-2 border-white text-white text-xl leading-none'>
                +
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className='space-y-4'>
        {/* Epic list (ở trên) */}
        <div>
          <div className='rounded-2xl border border-border/60 bg-surface shadow-sm'>
            <div className='border-b border-border/60 px-4 py-3'>
              <div className='text-sm font-semibold'>Epic</div>
              <div className='mt-1 text-xs text-muted'>Chọn Epic để lọc danh sách backlog</div>
            </div>

            <div className='p-2'>
              {epics.map((epic) => {
                const active = epic.id === selectedEpicId;
                return (
                  <button
                    key={epic.id}
                    type='button'
                    onClick={() => setSelectedEpicId(epic.id)}
                    className={[
                      'w-full rounded-xl px-3 py-2 text-left transition',
                      active
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'hover:bg-bg',
                    ].join(' ')}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <div className='truncate text-sm font-semibold text-foreground'>
                          {epic.name}
                        </div>
                        <div className='mt-0.5 line-clamp-2 text-xs text-muted'>
                          {epic.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {!epics.length && <div className='p-4 text-sm text-muted'>Chưa có Epic.</div>}
            </div>
          </div>
        </div>

        {/* Backlog Items (ở dưới) */}
        <div>
          <div className='rounded-2xl border border-border/60 bg-surface shadow-sm'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-border/60 px-4 py-3'>
              <div className='text-sm font-semibold'>
                Backlog Items
                <span className='ml-2 text-xs font-normal text-muted'>
                  ({filteredItems.length})
                </span>
              </div>
            </div>

            {/* ✅ 8 cột */}
            {/*
      1) checkbox
      2) issue
      3) title
      4) status
      5) priority
      6) epic
      7) points
      8) assignee
    */}
            <div
              className='grid items-center gap-3 px-4 py-3 text-xs font-semibold text-muted'
              style={{
                gridTemplateColumns: '110px 1fr 140px 120px 220px 90px 120px 48px',
              }}
            >
              <div>Issue</div>
              <div>Tiêu đề</div>
              <div>Trạng thái</div>
              <div>Priority</div>
              <div>Epic</div>
              <div className='text-center'>Points</div>
              <div className='text-right'>Assignee</div>
              <div />
            </div>

            <div className='border-t border-border/60' />

            {/* Rows */}
            {loading ? (
              <div className='p-4 text-sm text-muted'>Đang tải…</div>
            ) : filteredItems.length === 0 ? (
              <div className='p-4 text-sm text-muted'>Không có item phù hợp.</div>
            ) : (
              <div className='divide-y divide-border/60'>
                {filteredItems.map((it, idx) => {
                  const epic = epics.find((e) => e.id === it.epicId);

                  return (
                    <div
                      key={it.id}
                      className='grid items-center gap-3 px-4 py-4 hover:bg-bg'
                      style={{
                        gridTemplateColumns: '110px 1fr 140px 120px 220px 90px 120px 48px',
                      }}
                    >
                      {/* 1) checkbox */}

                      {/* 2) issue */}
                      <div className='text-xs font-semibold text-muted'>
                        {it.key || `ISSUE-${idx + 1}`}
                      </div>

                      {/* 3) title + desc */}
                      <div className='min-w-0'>
                        <div className='truncate text-sm font-semibold text-foreground'>
                          {it.title}
                        </div>
                        <div className='mt-0.5 line-clamp-1 text-xs text-muted'>
                          {it.description}
                        </div>
                      </div>

                      {/* 4) status */}
                      <div className='flex items-center'>
                        <Badge tone={statusTone[it.status] || 'default'}>
                          {it.status === 'IN_PROGRESS'
                            ? 'In Progress'
                            : it.status === 'TODO'
                              ? 'To Do'
                              : it.status === 'IN_REVIEW'
                                ? 'In Review'
                                : it.status}
                        </Badge>
                      </div>

                      {/* 5) priority */}
                      <div className='flex items-center'>
                        <Badge tone={priorityTone[it.priority] || 'default'}>
                          {it.priority === 'HIGH'
                            ? 'High'
                            : it.priority === 'MEDIUM'
                              ? 'Medium'
                              : 'Low'}
                        </Badge>
                      </div>

                      {/* 6) epic */}
                      <div className='flex items-center'>
                        <Badge tone='purple'>{epic?.name || '—'}</Badge>
                      </div>

                      {/* ✅ 7) points */}
                      <div className='text-center text-sm font-semibold'>{it.points ?? '-'}</div>

                      {/* ✅ 8) assignee (chỉ avatar) */}
                      <div className='flex items-center justify-end'>
                        {(it.assignees || []).slice(0, 1).map((a) => (
                          <Avatar key={a.name} name={a.name} avatar={a.avatar} />
                        ))}
                      </div>

                      {/* ✅ 9) action column (cột mới, trống header) */}
                      <div className='flex items-center justify-end'>
                        <MoreMenuButton
                          items={[{ label: 'Xóa', value: 'delete', tone: 'danger' }]}
                          onSelect={(action) => {
                            if (action.value === 'delete') console.log('delete', it.id);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className='mt-3 text-xs text-muted'>
            * Bước tiếp theo: làm modal Create Epic / Create Feature + nối API thật.
          </div>
        </div>
      </div>
      <CreateTaskModal
        open={openCreateTask}
        onClose={() => setOpenCreateTask(false)}
        onSubmit={(payload) => {
          console.log('create task payload:', payload);
          // TODO: gọi API create backlog item ở đây
        }}
      />
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={(payload) => {
          console.log('create epic payload:', payload);
          // TODO: gọi API create epic ở đây
        }}
      />
    </div>
  );
}
