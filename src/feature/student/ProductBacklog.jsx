// src/feature/student/ProductBacklog.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';
import CreateTaskModal from '@/shared/components/CreateTaskModal';
import CreateEpicModal from '@/shared/components/CreateEpicModal';
import MoreMenuButton from '@/shared/components/MoreMenuButton';

function Avatar({ name = '', avatar }) {
  const getInitials = (n) => {
    if (!n) return '?';
    const words = n.trim().split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  // Generate a consistent pastel background color based on the name
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  const bgColor = avatar ? 'var(--color-bg)' : stringToColor(name || '?');
  const textColor = avatar ? 'inherit' : '#334155'; // dark slate for contrast

  return (
    <div
      className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/60 shadow-sm'
      style={{ backgroundColor: bgColor }}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt={name} className='h-full w-full object-cover' />
      ) : (
        <span className='text-[13px] font-bold' style={{ color: textColor }}>
          {initials}
        </span>
      )}
    </div>
  );
}

function Badge({ children, tone = 'default', className = '', ...props }) {
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
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium max-w-full',
        map[tone] || map.default,
        className,
      ].join(' ')}
      {...props}
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
  const toast = useToast();
  const [projectId, setProjectId] = useState(null);
  const [epics, setEpics] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [selectedEpicId, setSelectedEpicId] = useState('');
  const [search, setSearch] = useState('');
  const [openCreateEpic, setOpenCreateEpic] = useState(false);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({
          PageNumber: 1,
          PageSize: 1,
        });

        if (res?.data?.items?.length > 0) {
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error('Không lấy được project');
      }
    };

    fetchProjectId();
  }, [toast]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!projectId) return;

      try {
        setLoading(true);

        const epicsRes = await productBacklogService.getEpics(projectId);

        let epicsData = [];
        if (epicsRes?.data?.items) {
          epicsData = epicsRes.data.items;
        } else if (epicsRes?.data) {
          epicsData = epicsRes.data;
        } else if (Array.isArray(epicsRes)) {
          epicsData = epicsRes;
        }

        let itemsData = [];
        try {
          const itemsRes = await productBacklogService.getWorkItemsBacklog(projectId);
          console.log('itemsRes from backend:', itemsRes);

          if (itemsRes?.data?.productBacklog?.items) {
            itemsData = itemsRes.data.productBacklog.items;
          } else if (itemsRes?.data?.items) {
            itemsData = itemsRes.data.items;
          } else if (itemsRes?.data) {
            itemsData = itemsRes.data;
          } else if (Array.isArray(itemsRes)) {
            itemsData = itemsRes;
          }
        } catch (e) {
          console.error('Failed to load backlog items', e);
        }

        if (!mounted) return;

        console.log('Setting Epics:', epicsData);
        console.log('Setting Items:', itemsData);

        setEpics(Array.isArray(epicsData) ? epicsData : []);
        setItems(Array.isArray(itemsData) ? itemsData : []);
        setSelectedEpicId(Array.isArray(epicsData) && epicsData.length > 0 ? epicsData[0].id : '');
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        toast.error('Failed to load Product Backlog');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [projectId, toast]);

  const filteredItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    const safeItems = Array.isArray(items) ? items : [];

    // Debug log to check what is going on with the filtering:
    console.log('--- Filtering Items ---');
    console.log('Total items in state:', safeItems.length);
    console.log('Selected Epic ID:', selectedEpicId);
    if (safeItems.length > 0) {
      console.log('Sample item parentId:', safeItems[0].parentId, safeItems[0]);
    }

    const result = safeItems
      .filter((it) => (selectedEpicId ? it.parentId === selectedEpicId : true))
      .filter((it) => {
        if (!s) return true;
        return (
          it.title?.toLowerCase().includes(s) ||
          it.description?.toLowerCase().includes(s) ||
          it.type?.toLowerCase().includes(s)
        );
      });

    console.log('Filtered result count:', result.length);
    return result;
  }, [items, selectedEpicId, search]);

  return (
    <div className='w-full space-y-4'>
      {/* Toolbar */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-8'>
          <div className='text-xl font-semibold whitespace-nowrap'>Product Backlog</div>

          <div className='relative w-full md:w-[320px]'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='h-10 w-full rounded-full border border-border/60 bg-surface px-4 pr-10 text-sm outline-none focus:border-primary/40'
              placeholder='Search backlog…'
            />
            <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted'>
              ⌕
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 mt-2 md:mt-0'>
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
              'bg-primary hover:bg-primary-hover',
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
              'bg-primary hover:bg-primary-hover',
            ].join(' ')}
          >
            <span>Create Issue</span>
            <span className='flex items-center justify-center h-5 w-5 rounded-full border-2 border-white text-white text-xl leading-none'>
              +
            </span>
          </button>
        </div>
      </div>
      {/* Body */}
      <div className='space-y-4'>
        {/* Epic list (ở trên) */}
        <div>
          <div className='rounded-2xl border border-border/60 bg-surface shadow-sm'>
            <div className='border-b border-border/60 px-4 py-3'>
              <div className='text-sm font-semibold'>Epic</div>
              <div className='mt-1 text-xs text-muted'>Select Epic to filter backlog items</div>
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
                          {epic.title || epic.name || 'Untitled Epic'}
                        </div>
                        <div
                          className='mt-0.5 line-clamp-2 text-xs text-muted'
                          dangerouslySetInnerHTML={{ __html: epic.description || '' }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}

              {!epics.length && <div className='p-4 text-sm text-muted'>No Epics found.</div>}
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
                gridTemplateColumns: '110px 1fr 140px 120px 90px 120px 48px',
              }}
            >
              <div>Issue</div>
              <div>Title</div>
              <div className='text-center'>Status</div>
              <div className='text-center'>Priority</div>
              <div className='text-center'>Points</div>
              <div className='text-center'>Assignee</div>
              <div />
            </div>

            <div className='border-t border-border/60' />

            {/* Rows */}
            {loading ? (
              <div className='p-4 text-sm text-muted'>Loading…</div>
            ) : filteredItems.length === 0 ? (
              <div className='p-4 text-sm text-muted'>No items found.</div>
            ) : (
              <div className='divide-y divide-border/60'>
                {filteredItems.map((it, idx) => {
                  return (
                    <div
                      key={it.workItemId || it.id || idx}
                      className='grid items-center gap-3 px-4 py-4 hover:bg-bg'
                      style={{
                        gridTemplateColumns: '110px 1fr 140px 120px 90px 120px 48px',
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
                        <div
                          className='mt-0.5 line-clamp-1 text-xs text-muted'
                          dangerouslySetInnerHTML={{ __html: it.description || '' }}
                        />
                      </div>

                      {/* 4) status */}
                      <div className='flex items-center justify-center'>
                        <Badge tone={statusTone[it.status] || 'default'}>
                          {it.status === 'IN_PROGRESS'
                            ? 'In Progress'
                            : it.status === 'TODO'
                              ? 'To Do'
                              : it.status === 'IN_REVIEW'
                                ? 'In Review'
                                : it.status === 'DONE'
                                  ? 'Done'
                                  : it.status}
                        </Badge>
                      </div>

                      {/* 5) priority */}
                      <div className='flex items-center justify-center'>
                        <Badge tone={priorityTone[it.priority] || 'default'}>
                          {it.priority === 'HIGH'
                            ? 'High'
                            : it.priority === 'MEDIUM'
                              ? 'Medium'
                              : 'Low'}
                        </Badge>
                      </div>

                      {/* ✅ 7) points */}
                      <div className='text-center text-sm font-semibold'>{it.points ?? '-'}</div>

                      {/* ✅ 8) assignee (chỉ avatar) */}
                      <div className='flex items-center justify-center'>
                        {(it.assignees || []).slice(0, 1).map((a) => (
                          <Avatar key={a.name} name={a.name} avatar={a.avatar} />
                        ))}
                      </div>

                      {/* ✅ 9) action column (cột mới, trống header) */}
                      <div className='flex items-center justify-end'>
                        <MoreMenuButton
                          items={[{ label: 'Delete', value: 'delete', tone: 'danger' }]}
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
        </div>
      </div>
      <CreateTaskModal
        open={openCreateTask}
        epics={epics}
        onClose={() => setOpenCreateTask(false)}
        onSubmit={async (payload) => {
          console.log('--- SUBMIT CREATE TASK ---');
          console.log('Form Payload:', payload);
          try {
            const apiPayload = {
              title: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: payload.dueDate || undefined,
              storyPoint: payload.points ? Number(payload.points) : 0,
            };
            console.log('API Payload Sent:', apiPayload);

            const res = await productBacklogService.createWorkItem(projectId, apiPayload);
            console.log('API Response Task:', res);

            if (res && res.isSuccess === false) {
              let errorMsg = 'Failed to create task';
              try {
                const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                if (parsed.errors) {
                  errorMsg = Object.entries(parsed.errors)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n');
                } else if (parsed.title) {
                  errorMsg = parsed.title;
                }
              } catch (_e) { }
              toast.error(errorMsg);
              return;
            }

            toast.success('Task created successfully');
            setOpenCreateTask(false);

            if (res?.data) {
              setItems((prev) => [...prev, res.data]);
            } else {
              window.location.reload();
            }
          } catch (e) {
            console.error('Failed to create task:', e);
            toast.error('Failed to create task');
          }
        }}
      />
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              title: payload.name,
              name: payload.name, // Send both just in case backend diverges
              description: payload.description,
              endDate: payload.endDate || undefined,
            };

            const res = await productBacklogService.createEpic(projectId, apiPayload);

            if (res && res.isSuccess === false) {
              let errorMsg = 'Failed to create epic';
              try {
                const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                if (parsed.errors) {
                  errorMsg = Object.entries(parsed.errors)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n');
                } else if (parsed.title) {
                  errorMsg = parsed.title;
                }
              } catch (_e) { }
              toast.error(errorMsg);
              return;
            }

            toast.success('Epic created successfully');
            setOpenCreateEpic(false);

            // Append the new Epic to the state locally
            if (res?.data) {
              setEpics((prev) => [...prev, res.data]);
            } else {
              window.location.reload(); // Fallback if no data is returned
            }
          } catch (e) {
            console.error('Failed to create epic:', e);
            toast.error('Failed to create epic');
          }
        }}
      />
    </div>
  );
}
