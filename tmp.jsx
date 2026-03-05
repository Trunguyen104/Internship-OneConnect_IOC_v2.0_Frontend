'use client';

import { useState, useEffect, useCallback } from 'react';
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

  // Fix 1: H├ám fetch lß║Ñy dß╗» liß╗çu tß╗½ cß╗òng Backlog (Chß╗⌐a cß║ú Sprint v├á Items)
  const fetchData = useCallback(
    async (id) => {
      if (!id) return;
      try {
        setLoading(true);
        // Gß╗ìi ─æ├║ng h├ám lß║Ñy dß╗» liß╗çu tß╗òng hß╗úp
        const res = await productBacklogService.getWorkItemsBacklog(id);

        // Theo cß║Ñu tr├║c JSON bß║ín gß╗¡i: data.sprints l├á mß║úng chß╗⌐a danh s├ích sprint
        if (res?.data?.sprints) {
          setSprints(res.data.sprints);
        } else {
          setSprints([]);
        }
      } catch (err) {
        console.error('Fetch Sprint Backlog failed:', err);
        toast.error('Lß╗ùi khi tß║úi dß╗» liß╗çu Sprint');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    const initProject = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          const id = res.data.items[0].projectId;
          setProjectId(id);
          fetchData(id);
        }
      } catch {
        toast.error('Kh├┤ng lß║Ñy ─æ╞░ß╗úc project');
      }
    };
    initProject();
  }, [fetchData, toast]);

  const mapStatusObj = {
    TODO: { label: 'To Do', className: 'bg-white text-gray-600 border border-gray-200' },
    IN_PROGRESS: {
      label: 'In Progress',
      className: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    DONE: { label: 'Done', className: 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' },
  };

  const stringToColorTuple = (str) => {
    let hash = 0;
    for (let i = 0; i < (str?.length || 0); i++) {
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
          className='inline-flex items-center gap-3 h-10 px-6 rounded-full text-white text-base font-semibold shadow-sm transition-colors bg-primary hover:bg-primary-hover'
        >
          <span>Create Sprint</span>
          <span className='flex items-center justify-center h-5 w-5 rounded-full border-2 border-white text-xl'>
            +
          </span>
        </button>
      </div>

      {loading ? (
        <div className='text-center py-10'>─Éang tß║úi dß╗» liß╗çu...</div>
      ) : sprints.length === 0 ? (
        <div className='rounded-2xl bg-white shadow-sm p-8 text-center text-slate-500'>
          Kh├┤ng c├│ dß╗» liß╗çu Sprint
        </div>
      ) : (
        sprints.map((sprint) => (
          <div
            key={sprint.sprintId}
            className='rounded-2xl bg-white shadow-sm overflow-hidden mb-6 border border-border/40'
          >
            {/* Header Sprint */}
            <div className='flex items-center justify-between border-b border-border/60 px-5 py-4 bg-gray-50/30'>
              <div className='flex items-center gap-4'>
                <div className='text-lg font-bold text-text'>{sprint.name}</div>
                <div className='px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 uppercase'>
                  {sprint.status}
                </div>
                <span className='text-sm text-muted'>({sprint.itemCount || 0} issues)</span>
              </div>
              <button className='h-9 rounded-full border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50'>
                Ho├án th├ánh Sprint
              </button>
            </div>

            <div className='divide-y divide-border/60'>
              {/* Header Cß╗Öt */}
              <div className='flex items-center justify-between px-5 py-3 bg-gray-50/50 border-b text-[11px] font-bold text-muted uppercase'>
                <div className='w-[120px]'>Issue</div>
                <div className='flex-1 pr-4 pl-4'>Summary</div>
                <div className='flex items-center justify-end'>
                  <div className='w-[100px] text-center'>Status</div>
                  <div className='w-[120px] text-center'>Type</div>
                  <div className='w-[90px] text-center'>Priority</div>
                  <div className='w-[50px] text-center'>Assignee</div>
                </div>
              </div>

              {/* Fix 2: Render danh s├ích Items tß╗½ mß║úng sprint.items */}
              {!sprint.items || sprint.items.length === 0 ? (
                <div className='px-5 py-8 text-center text-sm text-slate-400 italic'>
                  Sprint n├áy ch╞░a c├│ c├┤ng viß╗çc n├áo.
                </div>
              ) : (
                sprint.items.map((it) => {
                  const statusConfig = mapStatusObj[it.status?.toUpperCase()] || mapStatusObj.TODO;
                  return (
                    <div
                      key={it.workItemId}
                      className='flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors'
                    >
                      <div className='w-[120px] text-sm font-mono text-muted'>
                        {it.workItemId.substring(0, 8)}
                      </div>
                      <div className='flex-1 text-[13px] font-medium text-text truncate px-4'>
                        {it.title}
                      </div>
                      <div className='flex items-center justify-end'>
                        <div className='w-[100px] flex justify-center'>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusConfig.className}`}
                          >
                            {it.status}
                          </span>
                        </div>
                        <div className='w-[120px] flex justify-center'>
                          <span className='bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold'>
                            {it.type}
                          </span>
                        </div>
                        <div className='w-[90px] flex justify-center'>
                          <span className='px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600'>
                            {it.priority || 'Medium'}
                          </span>
                        </div>
                        <div className='w-[50px] flex justify-center'>
                          <div
                            className='h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold'
                            style={{
                              backgroundColor: stringToColorTuple(it.assigneeName || 'U').bg,
                              color: stringToColorTuple(it.assigneeName || 'U').text,
                            }}
                          >
                            {(it.assigneeName || '?').charAt(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className='px-5 py-3 border-t border-border/40'>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className='text-primary text-sm font-bold flex items-center gap-2 hover:underline'
              >
                <span>+</span> Tß║ío nhiß╗çm vß╗Ñ
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modals */}
      <CreateTaskModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateSprintModal
        open={isCreateSprintModalOpen}
        projectId={projectId}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              name: payload.name,
              title: payload.name,
              goal: payload.goal,
              description: payload.goal,
              workItemIds: payload.workItemIds || [],
            };
            console.log('Create Sprint payload:', apiPayload);
            const res = await productBacklogService.createSprint(projectId, apiPayload);
            console.log('Create Sprint response:', res);

            if (res && res.isSuccess === false) {
              let errorMsg = 'Lß╗ùi khi tß║ío Sprint';
              try {
                const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                if (parsed?.errors) {
                  errorMsg = Object.entries(parsed.errors)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n');
                } else if (parsed?.title) {
                  errorMsg = parsed.title;
                } else if (res.message) {
                  errorMsg = res.message;
                }
              } catch (e) {
                console.error('Error parsing creation sprint response:', e);
              }
              toast.error(errorMsg);
              return;
            }

            toast.success('Tß║ío Sprint th├ánh c├┤ng');
            setIsCreateSprintModalOpen(false);
            fetchData(projectId);
          } catch (error) {
            console.error('Failed to create sprint:', error);
            toast.error('Lß╗ùi khi tß║ío Sprint');
          }
        }}
      />
    </div>
  );
}
