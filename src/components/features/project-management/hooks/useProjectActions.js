'use client';

import { Modal } from 'antd';
import { useState } from 'react';

import {
  INTERNSHIP_MANAGEMENT_UI,
  PROJECT_STATUS,
} from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';

export const useProjectActions = ({
  editingRecord,
  fetchData,
  setMockData,
  groups,
  setModalVisible,
}) => {
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { PROJECT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { MESSAGES } = PROJECT_MANAGEMENT;

  const executeSave = async (values, isDraft) => {
    try {
      setSubmitLoading(true);
      const payload = {
        ...values,
        status: isDraft ? PROJECT_STATUS.DRAFT : PROJECT_STATUS.PUBLISHED,
      };

      try {
        if (editingRecord) {
          await ProjectService.update(editingRecord.projectId, payload);
          toast.success(MESSAGES.UPDATE_SUCCESS);
        } else {
          await ProjectService.create(payload);
          toast.success(isDraft ? MESSAGES.SAVE_DRAFT_SUCCESS : MESSAGES.PUBLISH_SUCCESS);
        }
      } catch (apiErr) {
        // Mock Update/Create
        if (editingRecord) {
          setMockData((prev) =>
            prev.map((p) => (p.projectId === editingRecord.projectId ? { ...p, ...payload } : p))
          );
          toast.success(MESSAGES.UPDATE_SUCCESS + ' (Mock)');
        } else {
          const newProject = {
            ...payload,
            projectId: Date.now().toString(),
            internshipGroup: groups.find(
              (g) => (g.id || g.internshipGroupId) === payload.internshipGroupId
            ) || { internshipGroupName: 'Unknown Group' },
          };
          setMockData((prev) => [newProject, ...prev]);
          toast.success(
            (isDraft ? MESSAGES.SAVE_DRAFT_SUCCESS : MESSAGES.PUBLISH_SUCCESS) + ' (Mock)'
          );
        }
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveProject = async (values, isDraft = true) => {
    try {
      // AC-07: Check if project is Published and has assigned students
      if (editingRecord && editingRecord.status === PROJECT_STATUS.PUBLISHED) {
        setSubmitLoading(true);
        try {
          const res = await ProjectService.getAssignedStudents(editingRecord.projectId);
          const studentCount = res?.data?.length || 0;

          if (studentCount > 0) {
            Modal.confirm({
              title: 'Confirm Project Update',
              content: MESSAGES.EDIT_WARNING.replace('{count}', studentCount),
              okText: 'Confirm',
              cancelText: 'Cancel',
              onOk: async () => {
                await executeSave(values, isDraft);
              },
              onCancel: () => {
                setSubmitLoading(false);
              },
            });
            return;
          }
        } catch (err) {
          // Specific mock case for Project '2'
          if (editingRecord.projectId === '2') {
            Modal.confirm({
              title: 'Confirm Project Update (Mock)',
              content: MESSAGES.EDIT_WARNING.replace('{count}', 3),
              okText: 'Confirm',
              cancelText: 'Cancel',
              onOk: async () => {
                await executeSave(values, isDraft);
              },
              onCancel: () => {
                setSubmitLoading(false);
              },
            });
            return;
          }
        }
      }
      await executeSave(values, isDraft);
    } catch (err) {
      toast.error('Failed to save project');
      setSubmitLoading(false);
    }
  };

  const handlePublishProject = (id) => {
    Modal.confirm({
      title: 'Publish Project',
      content: 'Once published, you can assign students and track progress. Proceed?',
      okText: 'Publish',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await ProjectService.publish(id);
          toast.success(MESSAGES.PUBLISH_SUCCESS);
          fetchData();
        } catch (err) {
          setMockData((prev) =>
            prev.map((p) => (p.projectId === id ? { ...p, status: PROJECT_STATUS.PUBLISHED } : p))
          );
          toast.success(MESSAGES.PUBLISH_SUCCESS + ' (Mock)');
          fetchData();
        }
      },
    });
  };

  const handleCompleteProject = async (id, setOverallLoading) => {
    try {
      const res = await ProjectService.getAssignedStudents(id);
      const uncompletedCount = res?.data?.filter((s) => s.status !== 'Completed').length || 0;

      const content =
        uncompletedCount > 0
          ? MESSAGES.WARNING_COMPLETE_STU.replace('{count}', uncompletedCount)
          : MESSAGES.COMPLETE_CONFIRM;

      Modal.confirm({
        title: 'Complete Project',
        content,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            setOverallLoading(true);
            await ProjectService.complete(id);
            toast.success(MESSAGES.COMPLETE_SUCCESS);
            fetchData();
          } catch (err) {
            setMockData((prev) =>
              prev.map((p) => (p.projectId === id ? { ...p, status: PROJECT_STATUS.COMPLETED } : p))
            );
            toast.success(MESSAGES.COMPLETE_SUCCESS + ' (Mock)');
            fetchData();
          } finally {
            setOverallLoading(false);
          }
        },
      });
    } catch (err) {
      Modal.confirm({
        title: 'Complete Project (Mock)',
        content: MESSAGES.COMPLETE_CONFIRM,
        onOk: () => {
          setMockData((prev) =>
            prev.map((p) => (p.projectId === id ? { ...p, status: PROJECT_STATUS.COMPLETED } : p))
          );
          toast.success(MESSAGES.COMPLETE_SUCCESS + ' (Mock)');
          fetchData();
        },
      });
    }
  };

  const handleDeleteProject = async (id, setOverallLoading) => {
    try {
      const res = await ProjectService.getAssignedStudents(id);
      const studentCount = res?.data?.length || 0;

      if (studentCount > 0) {
        toast.error(MESSAGES.ERROR_ASSIGNED_STU);
        return;
      }

      Modal.confirm({
        title: 'Delete Project',
        content: 'Are you sure you want to delete this project? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            setOverallLoading(true);
            await ProjectService.delete(id);
            toast.success(MESSAGES.DELETE_SUCCESS);
            fetchData();
          } catch (err) {
            setMockData((prev) => prev.filter((p) => p.projectId !== id));
            toast.success(MESSAGES.DELETE_SUCCESS + ' (Mock)');
            fetchData();
          } finally {
            setOverallLoading(false);
          }
        },
      });
    } catch (err) {
      Modal.confirm({
        title: 'Delete Project (Mock)',
        content: 'Are you sure you want to delete this project?',
        onOk: () => {
          setMockData((prev) => prev.filter((p) => p.projectId !== id));
          toast.success(MESSAGES.DELETE_SUCCESS + ' (Mock)');
          fetchData();
        },
      });
    }
  };

  return {
    submitLoading,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject,
    handleDeleteProject,
  };
};
