import React from 'react';
import { useToast } from '@/providers/ToastProvider';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { SPRINT_STATUS, WORK_ITEM_STATUS, MOVE_INCOMPLETE_ITEMS_OPTION } from '@/constants/enums';

import CreateTaskModal from '@/components/features/backlog/components/CreateTaskModal';
import UpdateTaskModal from '@/components/features/backlog/components/UpdateTaskModal';
import CreateEpicModal from '@/components/features/backlog/components/CreateEpicModal';
import StartSprintModal from '@/components/features/backlog/components/StartSprintModal';
import CompleteSprintModal from '@/components/features/backlog/components/CompleteSprintModal';
import CreateSprintModal from '@/components/features/backlog/components/CreateSprintModal';

export const BacklogModals = ({
  projectId,
  epics,
  setEpics,
  sprints,
  setSprints,
  setBacklogItems,
  fetchData,
  openCreateEpic,
  setOpenCreateEpic,
  openStartSprint,
  setOpenStartSprint,
  openCompleteSprint,
  setOpenCompleteSprint,
  openCreateTask,
  setOpenCreateTask,
  openUpdateTask,
  setOpenUpdateTask,
  openCreateSprint,
  setOpenCreateSprint,
  selectedTask,
  setSelectedTask,
  selectedSprintAction,
  activeSprintForTask,
  setActiveSprintForTask,
}) => {
  const toast = useToast();

  const formatToDateOnly = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <CreateEpicModal
        open={openCreateEpic}
        onClose={() => setOpenCreateEpic(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              projectId,
              name: payload.name,
              title: payload.name,
              nane: payload.name,
              description: payload.description,
              endDate: payload.endDate,
            };
            const res = await productBacklogService.createEpic(projectId, apiPayload);
            if (res && res.isSuccess === false) {
              toast.error(res.message || 'Lỗi khi tạo epic');
              return;
            }
            toast.success('Tạo Epic thành công');
            setOpenCreateEpic(false);

            if (res?.data) {
              const newEpic = {
                ...res.data,
                id: res.data.id || res.data.workItemId,
                title: res.data.title || res.data.name || payload.name,
              };
              setEpics((prev) => [...prev, newEpic]);
            } else {
              fetchData(projectId);
            }
          } catch (error) {
            console.error('CREATE EPIC ERROR:', error);
            toast.error('Lỗi mạng khi tạo Epic');
          }
        }}
      />

      <StartSprintModal
        open={openStartSprint}
        sprint={selectedSprintAction}
        issueCount={selectedSprintAction?.items?.length || 0}
        onClose={() => setOpenStartSprint(false)}
        onSubmit={async (payload) => {
          try {
            if (!selectedSprintAction) return;

            const targetId = selectedSprintAction.sprintId || selectedSprintAction.id;

            const startPayload = {
              projectId,
              name: payload.name,
              goal: payload.goal,
              startDate: formatToDateOnly(payload.startDate),
              endDate: formatToDateOnly(payload.endDate),
            };

            const resStart = await productBacklogService.startSprint(
              projectId,
              targetId,
              startPayload,
            );

            if (resStart && resStart.isSuccess !== false) {
              toast.success('Bắt đầu Sprint thành công');
              setSprints((prevSprints) =>
                prevSprints.map((s) =>
                  s.sprintId === selectedSprintAction.sprintId
                    ? { ...s, status: SPRINT_STATUS.ACTIVE }
                    : s,
                ),
              );
              setOpenStartSprint(false);
              fetchData(projectId);
            }
          } catch {
            toast.error('Lỗi khi bắt đầu Sprint');
          }
        }}
      />

      <CompleteSprintModal
        open={openCompleteSprint}
        sprint={selectedSprintAction}
        sprints={sprints}
        onClose={() => setOpenCompleteSprint(false)}
        onSubmit={async (payload) => {
          try {
            if (!selectedSprintAction) return;

            const completePayload = {
              projectId,
              incompleteItemsOption: payload.incompleteItemsOption,
              targetSprintId: payload.targetSprintId,
              newSprintName: payload.newSprintName || '',
            };

            const resComp = await productBacklogService.completeSprint(
              projectId,
              selectedSprintAction.sprintId || selectedSprintAction.id,
              completePayload,
            );

            if (resComp && resComp.isSuccess === false) {
              return toast.error(resComp.message || 'Lỗi khi hoàn thành Sprint');
            }

            toast.success('Hoàn thành Sprint thành công');
            setOpenCompleteSprint(false);

            if (payload.incompleteItemsOption === MOVE_INCOMPLETE_ITEMS_OPTION.TO_BACKLOG) {
              const undoneItems = selectedSprintAction.items.filter((it) => {
                const status = it.status?.name || it.status;
                return status !== WORK_ITEM_STATUS.DONE && status !== 'DONE';
              });

              setBacklogItems((prev) => [...prev, ...undoneItems]);
            }

            setSprints((prev) => prev.filter((s) => (s.sprintId || s.id) !== (selectedSprintAction.sprintId || selectedSprintAction.id)));

            setTimeout(() => {
              fetchData(projectId, false);
            }, 500);
          } catch (err) {
            console.error('COMPLETE ERROR:', err);
            toast.error('Lỗi server khi hoàn thành Sprint');
          }
        }}
      />

      <CreateTaskModal
        open={openCreateTask}
        epics={epics}
        sprints={sprints}
        initialSprintId={activeSprintForTask}
        onClose={() => {
          setOpenCreateTask(false);
          setActiveSprintForTask(null);
        }}
        onSubmit={async (payload) => {
          try {
            const targetSprintId = payload.sprintId || activeSprintForTask;

            const apiPayload = {
              projectId,
              title: payload.summary,
              name: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: formatToDateOnly(payload.dueDate),
              storyPoint: payload.points,
              sprintId: targetSprintId || null,
            };

            const resCreate = await productBacklogService.createWorkItem(projectId, apiPayload);

            if (!resCreate || resCreate.isSuccess === false) {
              throw new Error('Create failed');
            }

            const newWorkItemId =
              typeof resCreate.data === 'string'
                ? resCreate.data
                : resCreate.data.workItemId || resCreate.data.id;

            const epicName = epics.find((e) => e.id === payload.epic)?.title || '';

            const optimisticItem = {
              ...apiPayload,
              workItemId: newWorkItemId,
              id: newWorkItemId,
              epicName,
              sprintId: targetSprintId || null,
            };

            if (targetSprintId) {
              setSprints((prev) =>
                prev.map((s) =>
                  s.sprintId === targetSprintId
                    ? {
                      ...s,
                      items: [...(s.items || []), optimisticItem],
                      itemCount: (s.itemCount || 0) + 1,
                    }
                    : s,
                ),
              );
            } else {
              setBacklogItems((prev) => [...prev, optimisticItem]);
            }

            toast.success(
              targetSprintId ? 'Tạo và găm vào Sprint thành công!' : 'Tạo nhiệm vụ thành công!',
            );

            setOpenCreateTask(false);
            setActiveSprintForTask(null);

            setTimeout(() => {
              fetchData(projectId, false);
            }, 800);
          } catch (error) {
            console.error('ANTIGRAVITY ERROR:', error);
            toast.error('Lỗi khi tạo nhiệm vụ');
          }
        }}
      />

      <UpdateTaskModal
        open={openUpdateTask}
        epics={epics}
        sprints={sprints}
        initialData={selectedTask}
        onClose={() => {
          setOpenUpdateTask(false);
          setSelectedTask(null);
        }}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              projectId,
              title: payload.summary,
              name: payload.summary,
              description: payload.description,
              type: payload.type,
              status: payload.status,
              priority: payload.priority,
              parentId: payload.epic || null,
              assigneeId: payload.assignee || null,
              dueDate: formatToDateOnly(payload.dueDate),
              storyPoint: payload.points,
            };

            const currentSprintId = selectedTask?.sprintId;
            const newSprintId = payload.sprintId;
            const workItemId = payload.id;

            const resUpdate = await productBacklogService.updateWorkItem(
              projectId,
              workItemId,
              apiPayload,
            );
            if (!resUpdate || resUpdate.isSuccess === false) {
              throw new Error('Update failed');
            }

            if (currentSprintId !== newSprintId) {
              if (!newSprintId) {
                await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
              } else {
                await productBacklogService.moveWorkItemToSprint(
                  projectId,
                  workItemId,
                  newSprintId,
                );
              }
            }

            toast.success('Cập nhật nhiệm vụ thành công!');
            setOpenUpdateTask(false);
            setSelectedTask(null);

            fetchData(projectId, false);
          } catch (error) {
            console.error('UPDATE ERROR:', error);
            toast.error('Lỗi khi cập nhật nhiệm vụ');
          }
        }}
      />

      <CreateSprintModal
        open={openCreateSprint}
        projectId={projectId}
        onClose={() => setOpenCreateSprint(false)}
        onSubmit={async (payload) => {
          try {
            const apiPayload = {
              projectId,
              ...payload,
            };
            const res = await productBacklogService.createSprint(projectId, apiPayload);
            if (res && res.isSuccess === false) {
              toast.error(res.message || 'Lỗi khi tạo Sprint');
              return;
            }

            toast.success('Tạo Sprint thành công!');
            setOpenCreateSprint(false);
            fetchData(projectId, false);
          } catch (err) {
            console.error('CREATE SPRINT ERROR:', err);
            toast.error('Lỗi server khi tạo Sprint');
          }
        }}
      />
    </>
  );
};
