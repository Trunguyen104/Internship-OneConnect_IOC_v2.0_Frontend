'use client';

import { App } from 'antd';
import { useState } from 'react';

import {
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
} from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';

export const useProjectActions = ({
  editingRecord,
  fetchData,
  setMockData,
  groups,
  setModalVisible,
}) => {
  const { modal } = App.useApp();
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { MESSAGES } = PROJECT_MANAGEMENT;

  const getErrorMessage = (err, defaultMsg) => {
    // Backend structure: { message, errors: [ "reason" ], validationErrors }
    const resMsg = err.data?.errors?.[0] || err.data?.message || err.message;

    // Fallback: Translate common BE errors to English if they come back in VN
    if (resMsg?.includes('chưa được gắn với nhóm thực tập')) {
      return MESSAGES.ERROR_PUBLISH_NO_GROUP;
    }

    return resMsg || defaultMsg;
  };

  const executeSave = async (values, isDraft) => {
    try {
      setSubmitLoading(true);
      const payload = {
        projectName: values.name,
        projectCode: values.code,
        internshipId: values.internshipGroupId,
        description: values.description,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
        field: values.field,
        requirements: values.requirements,
        deliverables: values.deliverables,
        template: values.template === 'Scrum' ? 0 : values.template === 'Kanban' ? 1 : 2,
        status: isDraft ? PROJECT_STATUS.DRAFT : PROJECT_STATUS.PUBLISHED,
        resources: {
          attachments:
            values.attachments?.map((f) => ({
              name: f.name,
              url: f.url || f.response?.url,
              size: f.size,
              uid: f.uid,
            })) || [],
          links: values.links || [],
        },
      };

      // AC-02/AC-13: Cannot publish without a group
      if (!isDraft && !payload.internshipId) {
        toast.error(MESSAGES.ERROR_PUBLISH_NO_GROUP);
        return;
      }

      if (editingRecord) {
        await ProjectService.update(editingRecord.projectId, payload);
        toast.success(MESSAGES.UPDATE_SUCCESS);
      } else {
        await ProjectService.create(payload);
        toast.success(isDraft ? MESSAGES.SAVE_DRAFT_SUCCESS : MESSAGES.PUBLISH_SUCCESS);
      }

      setModalVisible(false);
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, MESSAGES.ERROR));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveProject = async (values, isDraft = true) => {
    try {
      // AC-11: Block saving if assigned group is archived or finished
      const selectedGroupId = values.internshipGroupId;
      const selectedGroup = groups.find((g) => (g.internshipId || g.id) === selectedGroupId);
      const groupStatus = selectedGroup?.status || selectedGroup?.groupStatus;
      if (groupStatus === 3 || groupStatus === 2) {
        toast.warning(PROJECT_MANAGEMENT.MESSAGES.ERROR_INACTIVE_GROUP);
        return;
      }

      // AC-07: Check if project is Published and has assigned students
      if (editingRecord && editingRecord.status === PROJECT_STATUS.PUBLISHED) {
        setSubmitLoading(true);
        try {
          const res = await ProjectService.getAssignedStudents(editingRecord.projectId);
          const studentCount = res?.data?.length || 0;

          if (studentCount > 0) {
            modal.confirm({
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
          // Standard API error handling
          console.error('Error fetching assigned students:', err);
        }
      }
      await executeSave(values, isDraft);
    } catch (err) {
      toast.error('Failed to save project');
      setSubmitLoading(false);
    }
  };

  const handlePublishProject = (id) => {
    modal.confirm({
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
          toast.error(getErrorMessage(err, 'Failed to publish project'));
        }
      },
    });
  };

  const handleCompleteProject = async (record, setOverallLoading) => {
    const id = typeof record === 'string' ? record : record.projectId || record.id;
    if (!id) {
      toast.error('Project ID is missing');
      return;
    }
    try {
      setOverallLoading?.(true);
      // Fetch full project detail to get group info and assigned students
      const [projectRes, studentsRes] = await Promise.all([
        ProjectService.getById(id),
        ProjectService.getAssignedStudents(id),
      ]);

      const projectDetail = projectRes?.data || projectRes;
      const assignedStudents = studentsRes?.data || studentsRes || [];
      const studentCount = assignedStudents.length;
      const groupName =
        projectDetail.groupInfo?.groupName || projectDetail.groupName || 'Unknown Group';

      // AC-07: If Intern Group is Active and has students, show warning
      const content =
        studentCount > 0
          ? MESSAGES.WARNING_COMPLETE_STU.replace('{groupName}', groupName).replace(
              '{count}',
              studentCount
            )
          : MESSAGES.COMPLETE_CONFIRM;

      modal.confirm({
        title: 'Complete Project',
        content,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            setOverallLoading?.(true);
            await ProjectService.complete(id);
            toast.success(MESSAGES.COMPLETE_SUCCESS);
            fetchData();
          } catch (err) {
            toast.error(getErrorMessage(err, 'Failed to complete project'));
          } finally {
            setOverallLoading?.(false);
          }
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to fetch project details for completion'));
    } finally {
      setOverallLoading?.(false);
    }
  };

  const handleDeleteProject = async (record, setOverallLoading) => {
    const id = typeof record === 'string' ? record : record.projectId || record.id;
    if (!id) {
      toast.error('Project ID is missing');
      return;
    }

    try {
      setOverallLoading?.(true);
      const res = await ProjectService.getAssignedStudents(id);
      const assignedStudents = res?.data || res || [];
      const studentCount = assignedStudents.length;

      // Case 3: Block delete if students are assigned (simple check for now)
      // Note: Backend will provide more granular check for "actual data" like logbooks
      if (studentCount > 0) {
        toast.error(MESSAGES.ERROR_ASSIGNED_STU);
        return;
      }

      modal.confirm({
        title: 'Delete Project',
        content: MESSAGES.DELETE_CONFIRM,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            setOverallLoading?.(true);
            await ProjectService.delete(id);
            toast.success(MESSAGES.DELETE_SUCCESS);
            fetchData();
          } catch (err) {
            toast.error(getErrorMessage(err, 'Failed to delete project'));
          } finally {
            setOverallLoading?.(false);
          }
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to check project status for deletion'));
    } finally {
      setOverallLoading?.(false);
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
