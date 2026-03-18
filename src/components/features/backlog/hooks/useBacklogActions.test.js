import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useBacklogActions } from './useBacklogActions';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { useToast } from '@/providers/ToastProvider';
import { SPRINT_STATUS, MOVE_INCOMPLETE_ITEMS_OPTION, WORK_ITEM_STATUS } from '@/constants/enums';
import { BACKLOG_UI } from '@/constants/backlog';

// Mock dependencies
vi.mock('@/providers/ToastProvider', () => ({
  useToast: vi.fn(),
}));

vi.mock('@/components/features/backlog/services/productbacklog.service', () => ({
  productBacklogService: {
    createEpic: vi.fn(),
    updateEpic: vi.fn(),
    deleteEpic: vi.fn(),
    startSprint: vi.fn(),
    completeSprint: vi.fn(),
    createWorkItem: vi.fn(),
    updateWorkItem: vi.fn(),
    moveWorkItemToBacklog: vi.fn(),
    moveWorkItemToSprint: vi.fn(),
    createSprint: vi.fn(),
    updateSprint: vi.fn(),
  },
}));

describe('useBacklogActions Hook', () => {
  const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const mockProps = {
    projectId: 'project-123',
    epics: [{ id: 'epic-1', title: 'Old Epic' }],
    setEpics: vi.fn(),
    setSprints: vi.fn(),
    setBacklogItems: vi.fn(),
    fetchData: vi.fn(),
    ui: {
      setOpenCreateEpic: vi.fn(),
      setOpenUpdateEpic: vi.fn(),
      setOpenStartSprint: vi.fn(),
      setOpenCompleteSprint: vi.fn(),
      setOpenCreateTask: vi.fn(),
      setOpenUpdateTask: vi.fn(),
      setOpenCreateSprint: vi.fn(),
      setOpenUpdateSprint: vi.fn(),
      setSelectedEpic: vi.fn(),
      setSelectedTask: vi.fn(),
      setActiveSprintForTask: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue(mockToast);
    vi.useFakeTimers();
  });

  describe('handleCreateEpic', () => {
    it('should create epic successfully and update epic list', async () => {
      const payload = { name: 'New Epic', description: 'Desc', endDate: '2024-12-31' };
      const apiResponse = { isSuccess: true, data: { id: 'epic-2', title: 'New Epic' } };
      productBacklogService.createEpic.mockResolvedValue(apiResponse);

      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleCreateEpic(payload);
      });

      expect(productBacklogService.createEpic).toHaveBeenCalledWith(
        'project-123',
        expect.objectContaining({
          title: 'New Epic',
          description: 'Desc',
        }),
      );
      expect(mockToast.success).toHaveBeenCalledWith(BACKLOG_UI.SUCCESS_CREATE_EPIC);
      expect(mockProps.ui.setOpenCreateEpic).toHaveBeenCalledWith(false);

      // Kiểm tra setter được gọi để update state local
      const updateFn = mockProps.setEpics.mock.calls[0][0];
      const newState = updateFn(mockProps.epics);
      expect(newState).toContainEqual(expect.objectContaining({ id: 'epic-2', title: 'New Epic' }));
    });

    it('should display error if API returns isSuccess: false when creating epic', async () => {
      productBacklogService.createEpic.mockResolvedValue({
        isSuccess: false,
        message: 'Invalid name',
      });
      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleCreateEpic({ name: '' });
      });

      expect(mockToast.error).toHaveBeenCalledWith('Invalid name');
      expect(mockProps.setEpics).not.toHaveBeenCalled();
    });
  });

  describe('handleStartSprint', () => {
    it('should start sprint and update status to ACTIVE', async () => {
      const selectedSprint = { sprintId: 'sprint-1' };
      const payload = {
        name: 'Sprint 1',
        goal: 'Goal',
        startDate: '2024-01-01',
        endDate: '2024-01-14',
      };
      productBacklogService.startSprint.mockResolvedValue({ isSuccess: true });

      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleStartSprint(selectedSprint, payload);
      });

      expect(productBacklogService.startSprint).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith(BACKLOG_UI.SUCCESS_START_SPRINT);

      // Kiểm tra việc cập nhật trạng thái sprint trong state
      const updateFn = mockProps.setSprints.mock.calls[0][0];
      const mockSprints = [{ sprintId: 'sprint-1', status: 'PLANNED' }];
      const newState = updateFn(mockSprints);
      expect(newState[0].status).toBe(SPRINT_STATUS.ACTIVE);
    });
  });

  describe('handleCompleteSprint', () => {
    it('should complete sprint and move incomplete items to backlog if selected', async () => {
      const selectedSprint = {
        sprintId: 'sprint-1',
        items: [
          { id: 'task-1', status: 'IN_PROGRESS' },
          { id: 'task-2', status: 'DONE' },
        ],
      };
      const payload = {
        incompleteItemsOption: MOVE_INCOMPLETE_ITEMS_OPTION.TO_BACKLOG,
      };
      productBacklogService.completeSprint.mockResolvedValue({ isSuccess: true });

      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleCompleteSprint(selectedSprint, payload);
      });

      expect(mockToast.success).toHaveBeenCalledWith(BACKLOG_UI.SUCCESS_COMPLETE_SPRINT);

      // Kiểm tra task chưa xong chuyển sang backlog
      const backlogUpdateFn = mockProps.setBacklogItems.mock.calls[0][0];
      const newBacklog = backlogUpdateFn([]);
      expect(newBacklog).toHaveLength(1);
      expect(newBacklog[0].id).toBe('task-1');

      // Check if sprint is removed from sprints list
      const sprintsUpdateFn = mockProps.setSprints.mock.calls[0][0];
      const newSprints = sprintsUpdateFn([{ sprintId: 'sprint-1' }]);
      expect(newSprints).toHaveLength(0);
    });
  });

  describe('handleCreateTask', () => {
    it('should create task in sprint and perform optimistic update', async () => {
      const payload = { summary: 'New Task', sprintId: 'sprint-1', points: 5 };
      productBacklogService.createWorkItem.mockResolvedValue({
        isSuccess: true,
        data: 'new-task-id',
      });

      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleCreateTask(payload, null);
      });

      expect(mockToast.success).toHaveBeenCalledWith(BACKLOG_UI.SUCCESS_CREATE_TASK_SPRINT);

      // Kiểm tra cập nhật state sprint (optimistic)
      const updateFn = mockProps.setSprints.mock.calls[0][0];
      const mockSprints = [{ sprintId: 'sprint-1', items: [], itemCount: 0 }];
      const newState = updateFn(mockSprints);

      expect(newState[0].items).toHaveLength(1);
      expect(newState[0].items[0].workItemId).toBe('new-task-id');
      expect(newState[0].itemCount).toBe(1);

      // Kiểm tra fetchData được gọi sau timeout
      act(() => {
        vi.runAllTimers();
      });
      expect(mockProps.fetchData).toHaveBeenCalled();
    });

    it('should display error if API create task failed', async () => {
      productBacklogService.createWorkItem.mockRejectedValue(new Error('Network Error'));
      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleCreateTask({ summary: 'Fail' });
      });

      expect(mockToast.error).toHaveBeenCalledWith(BACKLOG_UI.ERROR_CREATE_TASK);
    });
  });

  describe('handleUpdateTask', () => {
    it('should update task and move task to another sprint if sprintId changes', async () => {
      const selectedTask = { id: 'task-1', sprintId: 'sprint-old' };
      const payload = { id: 'task-1', summary: 'Updated', sprintId: 'sprint-new' };
      productBacklogService.updateWorkItem.mockResolvedValue({ isSuccess: true });
      productBacklogService.moveWorkItemToSprint.mockResolvedValue({ isSuccess: true });

      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleUpdateTask(selectedTask, payload);
      });

      expect(productBacklogService.updateWorkItem).toHaveBeenCalled();
      expect(productBacklogService.moveWorkItemToSprint).toHaveBeenCalledWith(
        'project-123',
        'task-1',
        'sprint-new',
      );
      expect(mockToast.success).toHaveBeenCalledWith(BACKLOG_UI.SUCCESS_UPDATE_TASK);
    });
  });

  describe('handleUpdateSprint', () => {
    it('should update sprint information locally before fetchData', async () => {
      const sprintId = 'sprint-123';
      const payload = { name: 'Updated Sprint Name' };
      productBacklogService.updateSprint.mockResolvedValue({ isSuccess: true });

      const { result } = renderHook(() => useBacklogActions(mockProps));

      await act(async () => {
        await result.current.handleUpdateSprint(sprintId, payload);
      });

      expect(productBacklogService.updateSprint).toHaveBeenCalled();

      // Kiểm tra local state update
      const updateFn = mockProps.setSprints.mock.calls[0][0];
      const mockSprints = [{ sprintId: 'sprint-123', name: 'Old Name' }];
      const newState = updateFn(mockSprints);
      expect(newState[0].name).toBe('Updated Sprint Name');
    });
  });
});
