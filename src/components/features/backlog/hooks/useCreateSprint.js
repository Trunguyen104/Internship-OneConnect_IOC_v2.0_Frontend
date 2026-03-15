import { useState, useEffect, useMemo, useCallback } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { useToast } from '@/providers/ToastProvider';

export function useCreateSprint(projectId, open) {
  const [sprintName, setSprintName] = useState('');
  const [goal, setGoal] = useState('');
  const [selectedEpicId, setSelectedEpicId] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  const [allEpics, setAllEpics] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const toast = useToast();

  const reset = useCallback(() => {
    setSprintName('');
    setGoal('');
    setSelectedItemIds([]);
    setSelectedEpicId('');
  }, []);

  useEffect(() => {
    if (open && projectId) {
      const fetchBacklog = async () => {
        try {
          setLoadingItems(true);
          const [resItems, resEpics] = await Promise.all([
            productBacklogService.getWorkItemsBacklog(projectId),
            productBacklogService.getEpics(projectId),
          ]);

          let itemsData = [];
          if (resItems?.data?.productBacklog?.items) {
            itemsData = resItems.data.productBacklog.items;
          } else if (resItems?.data?.items) {
            itemsData = resItems.data.items;
          } else if (resItems?.data && Array.isArray(resItems.data)) {
            itemsData = resItems.data;
          } else if (Array.isArray(resItems)) {
            itemsData = resItems;
          }

          let epicsData = [];
          if (resEpics?.data?.items) {
            epicsData = resEpics.data.items;
          } else if (resEpics?.data && Array.isArray(resEpics.data)) {
            epicsData = resEpics.data;
          } else if (Array.isArray(resEpics)) {
            epicsData = resEpics;
          }

          const epicMap = {};
          epicsData.forEach((e) => {
            epicMap[e.id] = e.name || e.title || 'Unknown Epic';
          });

          setAllEpics(epicsData);

          const enhancedItems = itemsData.map((it) => ({
            ...it,
            epicName: it.parentId ? epicMap[it.parentId] : null,
          }));

          setBacklogItems(enhancedItems);
        } catch (error) {
          console.error('Failed to fetch backlog items', error);
          toast.error('Lỗi khi tải danh sách Product Backlog');
        } finally {
          setLoadingItems(false);
        }
      };

      fetchBacklog();
    }
  }, [open, projectId, toast]);

  const filteredItems = useMemo(() => {
    if (!selectedEpicId) return [];
    return backlogItems
      .filter((it) => it.parentId === selectedEpicId)
      .map((it) => ({
        ...it,
        _id: it.workItemId || it.id,
      }));
  }, [backlogItems, selectedEpicId]);

  const toggleSelection = useCallback((id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const toggleAll = useCallback(() => {
    if (filteredItems.length === 0) return;

    const allSelected = filteredItems.every((it) => selectedItemIds.includes(it._id));

    if (allSelected) {
      const filteredIds = filteredItems.map((it) => it._id);
      setSelectedItemIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const newSelections = filteredItems
        .map((it) => it._id)
        .filter((id) => !selectedItemIds.includes(id));
      setSelectedItemIds((prev) => [...prev, ...newSelections]);
    }
  }, [filteredItems, selectedItemIds]);

  const isAllFilteredSelected = useMemo(() => {
    return (
      filteredItems.length > 0 && filteredItems.every((it) => selectedItemIds.includes(it._id))
    );
  }, [filteredItems, selectedItemIds]);

  const canSubmit = useMemo(() => sprintName.trim() !== '', [sprintName]);

  return {
    sprintName,
    setSprintName,
    goal,
    setGoal,
    selectedEpicId,
    setSelectedEpicId,
    selectedItemIds,
    allEpics,
    loadingItems,
    filteredItems,
    isAllFilteredSelected,
    toggleSelection,
    toggleAll,
    reset,
    canSubmit,
  };
}
