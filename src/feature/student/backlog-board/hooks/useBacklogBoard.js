import { useState, useCallback, useMemo, useEffect } from 'react';
import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
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
        setEpics(Array.isArray(epicsData) ? epicsData : []);

        // Parse Sprint/Backlog
        if (resBacklog?.data) {
          setSprints(resBacklog.data.sprints || []);

          let bkItems = [];
          if (resBacklog.data.productBacklog?.items) {
            bkItems = resBacklog.data.productBacklog.items;
          } else if (resBacklog.data.items) {
            bkItems = resBacklog.data.items;
          }
          setBacklogItems(bkItems);
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
    try {
      const sprintNum = sprints.length + 1;
      const payload = { name: `Sprint ${sprintNum}`, title: `Sprint ${sprintNum}` };
      const res = await productBacklogService.createSprint(projectId, payload);
      if (res && res.isSuccess === false) {
        toast.error(res.message || 'Lỗi khi tạo Sprint');
      } else {
        toast.success('Đã tạo một Sprint mới');
        fetchData(projectId);
      }
    } catch {
      toast.error('Lỗi khi tạo Sprint');
    }
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
    
    // Actions
    fetchData,
    handleDeleteSprint,
    handleSprintActionClick,
    handleQuickCreateSprint
  };
}
