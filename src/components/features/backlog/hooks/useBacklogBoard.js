import { useState, useCallback, useMemo, useEffect } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';

export function useBacklogBoard() {
  const toast = useToast();
  
  // Project State
  const [projectId, setProjectId] = useState(null);
  const [activeSprintForTask, setActiveSprintForTask] = useState(null);
  
  // Data State
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [selectedEpicId, setSelectedEpicId] = useState('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal State
  const [openCreateEpic, setOpenCreateEpic] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openUpdateTask, setOpenUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openStartSprint, setOpenStartSprint] = useState(false);
  const [openCompleteSprint, setOpenCompleteSprint] = useState(false);
  const [selectedSprintAction, setSelectedSprintAction] = useState(null);
  const [openCreateSprint, setOpenCreateSprint] = useState(false);

  // Initialize Project
  useEffect(() => {
    const initProject = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          const id = res.data.items[0].projectId;
          setProjectId(id);
        }
      } catch {
        toast.error('Không lấy được project');
      }
    };
    initProject();
  }, [toast]);

  // Fetch Data
  const fetchData = useCallback(
    async (id, showLoading = true) => {
      if (!id) return;
      try {
        if (showLoading) setLoading(true);

        const [resEpics, resBacklog] = await Promise.all([
          productBacklogService.getEpics(id),
          productBacklogService.getWorkItemsBacklog(id),
        ]);

        // Parse Epics
        let epicsData = [];
        if (resEpics?.data?.items) epicsData = resEpics.data.items;
        else if (resEpics?.data) epicsData = resEpics.data;
        else if (Array.isArray(resEpics)) epicsData = resEpics;

        // Ensure each epic has an 'id' field (mapped from workItemId if necessary)
        const normalizedEpics = Array.isArray(epicsData)
          ? epicsData.map((e) => ({
              ...e,
              id: e.id || e.workItemId,
            }))
          : [];

        setEpics(normalizedEpics);

        // Parse Sprint/Backlog
        if (resBacklog?.data) {
          const rawSprints = resBacklog.data.sprints || [];
          const normalizedSprints = rawSprints.map((s) => ({
            ...s,
            sprintId: s.sprintId || s.id,
            items: (s.items || []).map((it) => ({
              ...it,
              id: it.workItemId || it.id,
            })),
          }));
          setSprints(normalizedSprints);

          let bkItems = [];
          if (resBacklog.data.productBacklog?.items) {
            bkItems = resBacklog.data.productBacklog.items;
          } else if (resBacklog.data.items) {
            bkItems = resBacklog.data.items;
          }
          
          const normalizedBkItems = bkItems.map((it) => ({
            ...it,
            id: it.workItemId || it.id,
          }));
          setBacklogItems(normalizedBkItems);
        }
      } catch (err) {
        console.error('Fetch Data failed:', err);
        toast.error('Lỗi khi tải dữ liệu Backlog Board');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchData(projectId);
  }, [projectId, fetchData]);

  // Derived Logic for Data mapping
  const appendEpicName = useCallback((item) => {
    const found = epics.find((e) => e.id === item.parentId);
    return { ...item, epicName: found ? found.title || found.name : '' };
  }, [epics]);

  // Filter Logic
  const isSelectedEpic = useCallback((parentId) => {
    return selectedEpicId === 'ALL' || parentId === selectedEpicId;
  }, [selectedEpicId]);

  const filteredBacklogItems = useMemo(() => {
    return backlogItems.filter((it) => it && isSelectedEpic(it.parentId)).map(appendEpicName);
  }, [backlogItems, appendEpicName, isSelectedEpic]);

  const filteredSprints = useMemo(() => {
    return sprints.map((sp) => ({
      ...sp,
      items: (sp.items || []).filter((it) => it && isSelectedEpic(it.parentId)).map(appendEpicName),
    }));
  }, [sprints, appendEpicName, isSelectedEpic]);

  // Compute absolute creation order of all issues
  const itemOrders = useMemo(() => {
    const allItems = [...backlogItems];
    sprints.forEach((sp) => {
      if (sp.items) allItems.push(...sp.items);
    });

    const uniqueItemsMap = {};
    allItems.forEach((i) => {
      uniqueItemsMap[i.workItemId || i.id] = i;
    });
    const uniqueItems = Object.values(uniqueItemsMap);

    const sorted = uniqueItems.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) return timeA - timeB;

      const idA = a.workItemId || a.id || '';
      const idB = b.workItemId || b.id || '';
      return idA.localeCompare(idB);
    });

    const map = {};
    sorted.forEach((item, idx) => {
      map[item.workItemId || item.id] = idx + 1;
    });
    return map;
  }, [backlogItems, sprints]);

  // Actions
  const handleDeleteSprint = async (sprintId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Sprint này không? Các nhiệm vụ bên trong sẽ quay về Backlog.'))
      return;

    try {
      const res = await productBacklogService.deleteSprint(projectId, sprintId);
      if (res && res.isSuccess !== false) {
        toast.success('Xóa Sprint thành công');
        setSprints((prev) => prev.filter((s) => s.sprintId !== sprintId));
        fetchData(projectId, false);
      } else {
        toast.error(res.message || 'Không thể xóa Sprint');
      }
    } catch (err) {
      toast.error('Lỗi server khi xóa Sprint');
    }
  };

  const handleSprintActionClick = (sprint, isStart) => {
    setSelectedSprintAction(sprint);
    if (isStart) setOpenStartSprint(true);
    else setOpenCompleteSprint(true);
  };

  const handleQuickCreateSprint = async () => {
    // Instead of quick creation, we now open the dedicated modal
    setOpenCreateSprint(true);
  };

  return {
    projectId,
    epics,
    setEpics,
    sprints,
    setSprints,
    backlogItems,
    setBacklogItems,
    loading,
    selectedEpicId,
    setSelectedEpicId,
    isSidebarOpen,
    setIsSidebarOpen,
    filteredBacklogItems,
    filteredSprints,
    itemOrders,
    activeSprintForTask,
    setActiveSprintForTask,
    
    // Modal states
    openCreateEpic, setOpenCreateEpic,
    openCreateTask, setOpenCreateTask,
    openUpdateTask, setOpenUpdateTask,
    selectedTask, setSelectedTask,
    openStartSprint, setOpenStartSprint,
    openCompleteSprint, setOpenCompleteSprint,
    selectedSprintAction, setSelectedSprintAction,
    openCreateSprint, setOpenCreateSprint,
    
    // Actions
    fetchData,
    handleDeleteSprint,
    handleSprintActionClick,
    handleQuickCreateSprint,
    
    // Drag and Drop Handler
    handleDragEnd: async (event) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      let sourceSprintId = null;
      let draggedItem = null;

      // Find identifying the source and the item
      for (const s of sprints) {
        const found = (s.items || []).find((it) => (it.workItemId || it.id) === activeId);
        if (found) {
          sourceSprintId = s.sprintId;
          draggedItem = { ...found, workItemId: found.workItemId || found.id };
          break;
        }
      }

      if (!draggedItem) {
        const found = backlogItems.find((it) => (it.workItemId || it.id) === activeId);
        if (found) {
          draggedItem = { ...found, workItemId: found.workItemId || found.id };
        }
      }

      if (!draggedItem) return;
      
      const workItemId = draggedItem.workItemId;

      // Destination logic
      if (overId === 'BACKLOG') {
        if (sourceSprintId === null) return; // Already in backlog

        // CASE 2: Sprint to Backlog
        try {
          // Optimistic local update
          setSprints(prev => prev.map(s => 
            s.sprintId === sourceSprintId 
              ? { ...s, items: s.items.filter(it => (it.workItemId || it.id) !== activeId) }
              : s
          ));
          setBacklogItems(prev => [...prev, draggedItem]);

          const res = await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
          if (res?.isSuccess === false || res?.success === false) {
            throw new Error(res.message || res.data?.message || 'Không thể chuyển về Backlog');
          }
          toast.success('Đã chuyển nhiệm vụ về Backlog');
        } catch (err) {
          console.error('DND Error:', err);
          toast.error(err.message || 'Lỗi khi chuyển về Backlog');
          fetchData(projectId, false);
        }
      } else {
        // Destination is a Sprint (overId is sprintId)
        const targetSprintId = overId;
        if (sourceSprintId === targetSprintId) return;

        // CASE 1 & 3: Backlog to Sprint or Sprint to Sprint
        try {
          // Optimistic local update
          if (sourceSprintId) {
            setSprints(prev => prev.map(s => 
              s.sprintId === sourceSprintId 
                ? { ...s, items: s.items.filter(it => (it.workItemId || it.id) !== activeId) }
                : s.sprintId === targetSprintId
                ? { ...s, items: [...(s.items || []), { ...draggedItem, sprintId: targetSprintId }] }
                : s
            ));
          } else {
            setBacklogItems(prev => prev.filter(it => (it.workItemId || it.id) !== activeId));
            setSprints(prev => prev.map(s => 
              s.sprintId === targetSprintId
                ? { ...s, items: [...(s.items || []), { ...draggedItem, sprintId: targetSprintId }] }
                : s
            ));
          }

          console.log(`Moving item ${workItemId} to sprint ${targetSprintId}`);
          const res = await productBacklogService.moveWorkItemToSprint(projectId, workItemId, targetSprintId);
          
          if (res?.isSuccess === false || res?.success === false) {
            throw new Error(res.message || res.data?.message || 'Không thể chuyển vào Sprint');
          }
          toast.success('Đã chuyển nhiệm vụ vào Sprint');
        } catch (err) {
          console.error('DND Error:', err);
          toast.error(err.message || 'Lỗi khi chuyển vào Sprint');
          fetchData(projectId, false);
        }
      }
    }
  };
}

