'use client';

import { useState, useEffect } from 'react';
import CreateTaskModal from '@/shared/components/CreateTaskModal';
import CreateSprintModal from '@/shared/components/CreateSprintModal';
import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';

export default function SprintBacklog() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const toast = useToast();

  const [projectId, setProjectId] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
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

        const sprintsRes = await productBacklogService.getSprints(projectId);
        console.log('--- SPRINT FETCH RESULT ---', sprintsRes);

        // Temporarily log and try to set
        let sprintsData = [];
        if (sprintsRes?.data?.items) {
          sprintsData = sprintsRes.data.items;
        } else if (sprintsRes?.data) {
          sprintsData = sprintsRes.data;
        } else if (Array.isArray(sprintsRes)) {
          sprintsData = sprintsRes;
        }

        if (mounted) {
          setSprints(sprintsData);
        }

      } catch (err) {
        console.error('Fetch Sprint Backlog failed:', err);
        if (mounted) toast.error('Lỗi khi tải dữ liệu Sprint');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [projectId, toast]);

  // items state can be removed; we will use sprints data directly.

  const mapStatusObj = {
    TODO: { label: 'To Do', className: 'bg-white text-gray-600 border border-gray-200' },
    IN_PROGRESS: {
      label: 'In Progress',
      className: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    IN_REVIEW: {
      label: 'In Review',
      className: 'bg-red-50 text-red-600 border border-red-100',
    },
    DONE: { label: 'Done', className: 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' },
  };

  const getInitials = (n) => {
    if (!n) return '?';
    const words = n.trim().split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const stringToColorTuple = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return { bg: `hsl(${hue}, 70%, 90%)`, text: `hsl(${hue}, 70%, 30%)` };
  };

  return (
    <div className='w-full space-y-6'>
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={() => setIsCreateSprintModalOpen(true)}
          className={[
            'inline-flex items-center gap-3',
            'h-10 px-6 rounded-full',
            'text-white',
            'text-base font-semibold',
            'shadow-sm transition-colors',
            'bg-primary hover:bg-primary-hover',
          ].join(' ')}
        >
          <span>Create Sprint</span>
          <span className='flex items-center justify-center h-5 w-5 rounded-full border-2 border-white text-white text-xl leading-none'>
            +
          </span>
        </button>
      </div>

      {!loading && sprints.length === 0 && (
        <div className='rounded-2xl bg-white shadow-sm p-8 text-center text-slate-500'>
          Không có dữ liệu Sprint
        </div>
      )}

      {sprints.map((sprint, sprintIdx) => (
        <div
          key={sprint.sprintId || sprintIdx}
          className='rounded-2xl bg-white shadow-sm overflow-hidden'
        >
          {/* Header bảng */}
          <div className='flex items-center justify-between border-b border-border/60 px-5 py-4 bg-gray-50/30'>
            <div className='flex items-center gap-4 pl-1'>
              <div className='text-lg font-bold text-text'>
                {sprint.name || `Sprint ${sprintIdx + 1}`}
              </div>
              <div className='ml-3 px-2 py-0.5 rounded textxs font-semibold bg-gray-200 text-gray-700'>
                {sprint.status || 'Planned'}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                className='h-9 rounded-full border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50'
              >
                Hoàn thành Sprint
              </button>
            </div>
          </div>

          <div className='divide-y divide-border/60'>
            {/* Hàng Tiêu Đề Cột */}
            <div className='flex items-center justify-between px-5 py-3 bg-gray-50/50 border-b border-border/60'>
              <div className='flex items-center gap-4 w-[120px] shrink-0'>
                <div className='text-[11px] font-bold text-muted uppercase tracking-wider pl-1'>
                  Issue
                </div>
              </div>
              <div className='flex-1 min-w-0 pr-4 pl-4'>
                <div className='text-[11px] font-bold text-muted uppercase tracking-wider'>
                  Summary
                </div>
              </div>
              <div className='flex items-center justify-end shrink-0'>
                <div className='w-[100px] flex justify-center'>
                  <span className='text-[11px] font-bold text-muted uppercase tracking-wider'>
                    Status
                  </span>
                </div>
                <div className='w-[220px] flex justify-center px-4'>
                  <span className='text-[11px] font-bold text-muted uppercase tracking-wider'>
                    Epic / Tag
                  </span>
                </div>
                <div className='w-[90px] text-center text-[11px] font-bold text-muted uppercase tracking-wider'>
                  Due Date
                </div>
                <div className='w-[40px] text-center text-[11px] font-bold text-muted uppercase tracking-wider'>
                  Pts
                </div>
                <div className='w-[90px] flex justify-center'>
                  <span className='text-[11px] font-bold text-muted uppercase tracking-wider'>
                    Priority
                  </span>
                </div>
                <div className='w-[50px] flex justify-center'>
                  <span className='text-[11px] font-bold text-muted uppercase tracking-wider'>
                    Assignee
                  </span>
                </div>
                <div className='w-[32px]'></div>
              </div>
            </div>

            {/* Empty state for WorkItems on this Sprint */}
            {(!sprint.featureWorkItems || sprint.featureWorkItems.length === 0) && (
              <div className='px-5 py-8 text-center text-sm text-slate-500'>
                Sprint này chưa có công việc nào.
              </div>
            )}

            {/* Render WorkItems inside the Sprint using featureWorkItems (Placeholder array name for mapping) */}
            {(sprint.featureWorkItems || []).map((it) => {
              const statusConfig = mapStatusObj[it.status] || mapStatusObj.TODO;

              const priorityBadgeClass =
                it.priority === 'HIGH'
                  ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                  : 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]';
              const priorityLabel = it.priority === 'HIGH' ? 'High' : 'Medium';

              return (
                <div
                  key={it.id}
                  className='flex items-center justify-between px-5 py-3 hover:bg-bg transition-colors'
                >
                  {/* 1. Checkbox (REMOVED) & ID */}
                  <div className='flex items-center gap-4 w-[120px] shrink-0'>
                    <div className='text-sm font-semibold text-muted pl-1'>{it.key}</div>
                  </div>

                  {/* 2. Nội dung công việc (flexible) */}
                  <div className='flex-1 min-w-0 pr-4 pl-4'>
                    <div
                      className='truncate text-[13px] font-medium text-text tracking-tight'
                      dangerouslySetInnerHTML={{ __html: it.title || it.name || 'Untitled Issue' }}
                    />
                  </div>

                  {/* Phần bên phải - Các cột fixed width để thẳng hàng */}
                  <div className='flex items-center justify-end shrink-0'>
                    {/* 3. Trạng thái */}
                    <div className='w-[100px] flex justify-center'>
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
                          statusConfig.className,
                        ].join(' ')}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* 4. Tags/Epic */}
                    <div className='w-[220px] flex justify-center px-4'>
                      <span className='inline-flex items-center justify-center rounded-full bg-[#F3F0FF] text-[#6D28D9] border border-[#E9D5FF] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide w-full truncate'>
                        {it.type || 'N/A'}
                      </span>
                    </div>

                    {/* 5. Ngày tháng (Mờ) */}
                    <div className='w-[90px] text-center text-[13px] text-muted font-medium'>
                      {it.date}
                    </div>

                    {/* Points (Màu đỏ theo thiết kế) */}
                    <div className='w-[40px] text-center text-[13px] font-bold text-[#DC2626]'>
                      {it.points === '-' ? '-' : it.points}
                    </div>

                    {/* 6. Độ ưu tiên */}
                    <div className='w-[90px] flex justify-center'>
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-3 py-0.5 text-[12px] font-semibold',
                          priorityBadgeClass,
                        ].join(' ')}
                      >
                        {priorityLabel}
                      </span>
                    </div>

                    {/* 7. Ký hiệu bổ sung (Assignee Icon) */}
                    <div className='w-[50px] flex justify-center'>
                      {it.assigneeIcon ? (
                        <div
                          className='flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-bold'
                          style={{
                            backgroundColor: stringToColorTuple(it.assigneeIcon).bg,
                            color: stringToColorTuple(it.assigneeIcon).text,
                          }}
                        >
                          {getInitials(it.assigneeIcon)}
                        </div>
                      ) : (
                        <div className='flex h-[26px] w-[26px] items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400'>
                          ?
                        </div>
                      )}
                    </div>

                    {/* 8. Menu Icon */}
                    <div className='w-[32px] flex justify-end'>
                      <button
                        type='button'
                        className='text-muted hover:text-text transition-colors'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <circle cx='12' cy='12' r='1' />
                          <circle cx='12' cy='5' r='1' />
                          <circle cx='12' cy='19' r='1' />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nút Tạo nhiệm vụ ở cuối */}
          <div className='px-5 py-4 border-t border-border/60'>
            <button
              type='button'
              onClick={() => setIsCreateModalOpen(true)}
              className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 hover:bg-primary/10 transition-colors'
            >
              <span className='font-bold text-primary'>+</span>
              <span className='text-sm font-semibold text-primary'>Tạo nhiệm vụ</span>
            </button>
          </div>
        </div>
      ))}

      <CreateTaskModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('New Task:', data);
          // TODO: Optionally add functionality here to prepend task to the backend via service
        }}
      />

      <CreateSprintModal
        open={isCreateSprintModalOpen}
        projectId={projectId}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            await productBacklogService.createSprint(projectId, payload);
            toast.success('Tạo Sprint thành công');
            setIsCreateSprintModalOpen(false);

            // Temporary trigger reload to fetch new list since we lack a refetch hook right now
            window.location.reload();
          } catch (error) {
            console.error('Failed to create sprint:', error);
            const errs = error?.response?.data?.errors;
            if (errs && errs !== null) {
              const errorMessage = Object.values(errs).flat().join('\n');
              toast.error(errorMessage);
            } else {
              toast.error('Lỗi khi tạo Sprint');
            }
          }
        }}
      />
    </div>
  );
}
