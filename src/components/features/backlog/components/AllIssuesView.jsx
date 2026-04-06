'use client';

import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import { productBacklogService } from '@/components/features/backlog/services/product-backlog.service';
import { ProjectService } from '@/components/features/project/services/project.service';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/emptystate';
import Pagination from '@/components/ui/pagination';
import SearchBar from '@/components/ui/searchbar';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

import { useBacklogBoard } from '../hooks/useBacklogBoard';
import { BacklogModals } from './BacklogModals';
import { ColumnHeaders, WorkItem } from './WorkItem';

export default function AllIssuesView() {
  const {
    epics,
    setEpics,
    sprints,
    setSprints,
    setBacklogItems,
    searchText,
    setSearchText,
    itemOrders,
    activeSprintForTask,
    setActiveSprintForTask,

    openCreateEpic,
    setOpenCreateEpic,
    openUpdateEpic,
    setOpenUpdateEpic,
    selectedEpic,
    setSelectedEpic,
    openCreateTask,
    setOpenCreateTask,
    openUpdateTask,
    setOpenUpdateTask,
    selectedTask,
    setSelectedTask,
    openStartSprint,
    setOpenStartSprint,
    openCompleteSprint,
    setOpenCompleteSprint,

    handleDeleteWorkItem,
    fetchData: refetchBoard,
    openCreateSprint,
    setOpenCreateSprint,
    openUpdateSprint,
    setOpenUpdateSprint,
    members,
  } = useBacklogBoard();

  const { internshipGroupId } = useParams();

  // 1. Fetch all projects student belongs to
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['all-projects-for-history', internshipGroupId],
    queryFn: async () => {
      if (!internshipGroupId) return [];
      const res = await ProjectService.getByInternshipGroup(internshipGroupId);
      const data = res?.data || res;
      return data?.items || (Array.isArray(data) ? data : []);
    },
    enabled: !!internshipGroupId,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Consolidate ALL tasks from ALL projects
  const { data: allTasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['all-tasks-history', projects.map((p) => p.projectId)],
    queryFn: async () => {
      if (projects.length === 0) return [];

      const results = await Promise.allSettled(
        projects.map((p) =>
          Promise.all([
            productBacklogService.getWorkItems(p.projectId),
            productBacklogService.getEpics(p.projectId),
          ])
        )
      );

      const consolidated = [];
      results.forEach((res, idx) => {
        if (res.status === 'fulfilled' && res.value?.[0]?.data) {
          const data = res.value[0].data;
          const resEpics = res.value[1];

          // Extract epics for this project
          const projectEpics =
            resEpics?.data?.items ||
            resEpics?.items ||
            (Array.isArray(resEpics?.data)
              ? resEpics.data
              : Array.isArray(resEpics)
                ? resEpics
                : []);

          const projectName = projects[idx]?.name || 'Unknown Project';

          const enrich = (it) => {
            const pid =
              it.parentId ||
              it.parentID ||
              it.epicId ||
              it.epic_id ||
              it.parentid ||
              it.parentWorkItemId;
            if (!pid) return { ...it, projectName, epicName: '' };

            const found = projectEpics.find((e) => {
              const eid = e.id || e.workItemId || e.epicId || e.epicID;
              return (
                String(eid || '')
                  .toLowerCase()
                  .trim() ===
                String(pid || '')
                  .toLowerCase()
                  .trim()
              );
            });
            return {
              ...it,
              projectName,
              epicName: found ? found.title || found.name || found.summary : '',
            };
          };

          // From backlog
          const bkItems = data.productBacklog?.items || data.items || [];
          bkItems.forEach((it) => consolidated.push(enrich(it)));

          // From sprints
          const sps = data.sprints || [];
          sps.forEach((s) => {
            const items = s.items || s.featureWorkItems || [];
            items.forEach((it) =>
              consolidated.push({
                ...enrich(it),
                sprintName: s.name,
              })
            );
          });
        }
      });

      // Dedup and sort
      const uniqueMap = {};
      consolidated.forEach((it) => {
        if (it) {
          const id = it.workItemId || it.id;
          uniqueMap[id] = it;
        }
      });

      return Object.values(uniqueMap).sort((a, b) => {
        const tA = new Date(a.createdAt || 0).getTime();
        const tB = new Date(b.createdAt || 0).getTime();
        return tB - tA;
      });
    },
    enabled: projects.length > 0,
    staleTime: 1000, // Keep it fresh
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return allTasks.filter((it) => {
      if (!query) return true;
      const summary = (it.title || it.name || '').toString().toLowerCase();
      const epic = (it.epicName || '').toString().toLowerCase();
      const assignee = (it.assigneeName || '').toString().toLowerCase();
      const project = (it.projectName || '').toString().toLowerCase();
      return (
        summary.includes(query) ||
        epic.includes(query) ||
        assignee.includes(query) ||
        project.includes(query)
      );
    });
  }, [allTasks, searchText]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex min-h-0 flex-1 flex-col space-y-6 pb-12 duration-500">
      {!loadingProjects && projects.length > 0 && (
        <header className="flex items-center justify-end gap-3 px-1">
          <SearchBar
            value={searchText}
            onChange={(val) => {
              setSearchText(val);
              setCurrentPage(1);
            }}
            placeholder="Search all historical tasks..."
            width="w-full sm:w-[360px]"
            showFilter={false}
          />
          <Button
            variant="destructive"
            size="lg"
            onClick={() => {
              setActiveSprintForTask(null);
              setOpenCreateTask(true);
            }}
            className="flex h-10 items-center gap-2 rounded-2xl shadow-lg shadow-danger/20 active:scale-95 px-6"
            icon={<PlusCircleOutlined className="text-xl" />}
          >
            <span>{BACKLOG_UI.CREATE_TASK}</span>
          </Button>
        </header>
      )}

      {!loadingProjects && projects.length === 0 ? (
        <div className="flex flex-1 w-full items-center justify-center p-14 bg-white rounded-[40px] border border-slate-100 shadow-sm shadow-slate-100/30 overflow-hidden animate-in fade-in zoom-in duration-700 min-h-[600px]">
          <EmptyState
            title={BACKLOG_UI.NO_PROJECT_TITLE}
            description={BACKLOG_UI.NO_PROJECT_DESC}
            className="py-10"
          />
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 p-6 shadow-sm shadow-slate-100/30">
          <ColumnHeaders />
          <div className="min-h-[300px] space-y-1 mb-6">
            {loadingTasks ? (
              <div className="flex py-24 flex-col items-center justify-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
                <div className="text-slate-400 text-sm font-black uppercase tracking-widest">
                  {BACKLOG_UI.COMPILING_HISTORY}
                </div>
              </div>
            ) : paginatedTasks.length === 0 ? (
              <div className="flex py-24 flex-col items-center justify-center text-center">
                <div className="h-16 w-16 mb-4 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <History className="h-8 w-8" />
                </div>
                <div className="max-w-xs space-y-1">
                  <h4 className="text-lg font-black text-slate-800">
                    {BACKLOG_UI.NO_TASK_HISTORY}
                  </h4>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed">
                    {BACKLOG_UI.NO_TASK_HISTORY_DESC}
                  </p>
                </div>
              </div>
            ) : (
              paginatedTasks.map((it, idx) => {
                const startIndex = (currentPage - 1) * pageSize;
                const dynamicOrder = startIndex + idx + 1;
                const orderToUse = itemOrders[it.workItemId || it.id] || dynamicOrder;

                return (
                  <WorkItem
                    key={it.workItemId || it.id}
                    it={it}
                    itemOrder={orderToUse}
                    onDelete={() => handleDeleteWorkItem?.(it.workItemId || it.id)}
                    onClick={async (task) => {
                      try {
                        const targetProjId = task.projectId || projects[0]?.projectId;
                        const res = await productBacklogService.getWorkItemById(
                          targetProjId,
                          task.workItemId || task.id
                        );
                        setSelectedTask(res?.data ? { ...task, ...res.data } : task);
                      } catch (e) {
                        console.error(e);
                        setSelectedTask(task);
                      }
                      setOpenUpdateTask(true);
                    }}
                  />
                );
              })
            )}
          </div>

          {/* Pagination UI */}
          {!loadingTasks && filtered.length > 0 && (
            <div className="pt-4 border-t border-slate-50">
              <Pagination
                total={filtered.length}
                page={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </div>
      )}

      <BacklogModals
        projectId={projects[0]?.projectId}
        epics={epics}
        setEpics={setEpics}
        sprints={sprints}
        setSprints={setSprints}
        setBacklogItems={setBacklogItems}
        fetchData={refetchBoard}
        openCreateEpic={openCreateEpic}
        setOpenCreateEpic={setOpenCreateEpic}
        openUpdateEpic={openUpdateEpic}
        setOpenUpdateEpic={setOpenUpdateEpic}
        openStartSprint={openStartSprint}
        setOpenStartSprint={setOpenStartSprint}
        openCompleteSprint={openCompleteSprint}
        setOpenCompleteSprint={setOpenCompleteSprint}
        openCreateTask={openCreateTask}
        setOpenCreateTask={setOpenCreateTask}
        openUpdateTask={openUpdateTask}
        setOpenUpdateTask={setOpenUpdateTask}
        openCreateSprint={openCreateSprint}
        setOpenCreateSprint={setOpenCreateSprint}
        openUpdateSprint={openUpdateSprint}
        setOpenUpdateSprint={setOpenUpdateSprint}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        selectedEpic={selectedEpic}
        setSelectedEpic={setSelectedEpic}
        activeSprintForTask={activeSprintForTask}
        setActiveSprintForTask={setActiveSprintForTask}
        members={members}
      />
    </div>
  );
}
