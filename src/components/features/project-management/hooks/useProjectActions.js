'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import dayjs from 'dayjs';

import {
  getOperationalStatus,
  OPERATIONAL_STATUS,
  PROJECT_MANAGEMENT,
} from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';

export const useProjectActions = ({
  editingRecord,
  fetchData,
  groups,
  setModalVisible,
  userInfo,
}) => {
  const toast = useToast();
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const { MESSAGES } = PROJECT_MANAGEMENT;

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    queryClient.invalidateQueries({ queryKey: ['project-detail'] });
    fetchData?.();
  };

  const getErrorMessage = (err, defaultMsg) => {
    const resMsg = err.data?.errors?.[0] || err.data?.message || err.message;
    if (resMsg?.includes(MESSAGES.ERROR_PUBLISH_NO_GROUP_VN)) {
      return MESSAGES.ERROR_PUBLISH_NO_GROUP;
    }
    return resMsg || defaultMsg;
  };

  // --- MUTATIONS ---

  const saveMutation = useMutation({
    mutationFn: async ({ values, isDraft }) => {
      if (editingRecord) {
        const oldGroupId = editingRecord.internshipId || editingRecord.internshipGroupId;
        const newGroupId = values.internshipGroupId;
        const isAssigning =
          newGroupId && (!oldGroupId || oldGroupId === '00000000-0000-0000-0000-000000000000');
        const isSwapping =
          newGroupId &&
          oldGroupId &&
          oldGroupId !== '00000000-0000-0000-0000-000000000000' &&
          oldGroupId !== newGroupId;

        const updateForm = new FormData();
        updateForm.append('ProjectName', values.name || '');
        updateForm.append('Description', values.description || '');
        if (values.startDate) updateForm.append('StartDate', values.startDate.toISOString());
        if (values.endDate) updateForm.append('EndDate', values.endDate.toISOString());
        updateForm.append('Field', values.field || '');
        updateForm.append('Requirements', values.requirements || '');
        updateForm.append('Deliverables', values.deliverables || '');
        updateForm.append('Template', values.template ?? 2);
        if (values.code) updateForm.append('ProjectCode', values.code);

        // New file uploads
        if (values.attachments && values.attachments.length > 0) {
          values.attachments.forEach((file) => {
            if (file.originFileObj) {
              updateForm.append('Files', file.originFileObj);
            }
          });
        }

        // New quick links
        if (values.links && values.links.length > 0) {
          values.links.forEach((link, idx) => {
            updateForm.append(`Links[${idx}].ResourceName`, link.title || link.url || '');
            updateForm.append(`Links[${idx}].Url`, link.url || '');
          });
        }

        // Resources to delete
        if (values.resourceDeleteIds && values.resourceDeleteIds.length > 0) {
          values.resourceDeleteIds
            .filter((rid) => rid && rid !== 'undefined')
            .forEach((rid) => {
              updateForm.append('ResourceDeleteIds', rid);
            });
        }

        await ProjectService.update(editingRecord.projectId, updateForm);

        if (isAssigning) {
          await ProjectService.assignGroup(editingRecord.projectId, newGroupId);
        } else if (isSwapping) {
          await ProjectService.changeGroup(editingRecord.projectId, newGroupId);
        }

        const currentVis = Number(editingRecord.visibilityStatus ?? editingRecord.visibility ?? 0);
        if (!isDraft && currentVis === 0) {
          try {
            await ProjectService.publish(editingRecord.projectId);
          } catch (pErr) {
            const pMsg = pErr.data?.errors?.[0] || pErr.data?.message || pErr.message || '';
            if (!pMsg.includes(MESSAGES.ERROR_ALREADY_PUBLISHED_VN)) {
              throw pErr;
            }
          }
        }
        return { isDraft, isEdit: true };
      } else {
        const formData = new FormData();
        formData.append('ProjectName', values.name || '');
        formData.append('Description', values.description || '');
        if (values.startDate) formData.append('StartDate', values.startDate.toISOString());
        if (values.endDate) formData.append('EndDate', values.endDate.toISOString());
        formData.append('Field', values.field || '');
        formData.append('Requirements', values.requirements || '');
        if (values.deliverables) formData.append('Deliverables', values.deliverables);
        formData.append('Template', values.template ?? 2);
        formData.append('Status', isDraft ? 0 : 1);
        formData.append('PublishOnSave', !isDraft);

        if (values.internshipGroupId) {
          formData.append('InternshipGroupId', values.internshipGroupId);
        }

        if (values.code) {
          formData.append('ProjectCode', values.code);
        }

        if (values.links && values.links.length > 0) {
          values.links.forEach((link, idx) => {
            formData.append(`Links[${idx}].ResourceName`, link.title || link.url || '');
            formData.append(`Links[${idx}].Url`, link.url || '');
          });
        }

        if (values.attachments && values.attachments.length > 0) {
          values.attachments.forEach((file) => {
            if (file.originFileObj) {
              formData.append('Files', file.originFileObj);
            }
          });
        }

        await ProjectService.create(formData);
        return { isDraft, isEdit: false };
      }
    },
    onSuccess: ({ isDraft, isEdit }) => {
      if (isEdit) {
        toast.success(MESSAGES.UPDATE_SUCCESS);
      } else {
        toast.success(isDraft ? MESSAGES.SUCCESS_SAVE_DRAFT : MESSAGES.SUCCESS_SAVE_PUBLISH);
      }
      setModalVisible(false);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, MESSAGES.ERROR));
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id) => ProjectService.publish(id),
    onSuccess: () => {
      toast.success(MESSAGES.PUBLISH_SUCCESS);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_PUBLISH));
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id) => ProjectService.unpublish(id),
    onSuccess: () => {
      toast.success(MESSAGES.SUCCESS_UNPUBLISH);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_UNPUBLISH));
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id) => ProjectService.archive(id),
    onSuccess: () => {
      toast.success(MESSAGES.SUCCESS_ARCHIVE);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_ARCHIVE));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id) => ProjectService.complete(id),
    onSuccess: () => {
      toast.success(MESSAGES.COMPLETE_SUCCESS);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_COMPLETE));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ProjectService.delete(id),
    onSuccess: () => {
      toast.success(MESSAGES.DELETE_SUCCESS);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_DELETE));
    },
  });

  const assignGroupMutation = useMutation({
    mutationFn: async ({ assigningProject, selectedGroupId }) => {
      const oldGroupId =
        assigningProject.internshipId ||
        assigningProject.internshipGroupId ||
        assigningProject.groupId;

      if (!oldGroupId || oldGroupId === '00000000-0000-0000-0000-000000000000') {
        await ProjectService.assignGroup(assigningProject.projectId, selectedGroupId);
        return { type: 'ASSIGN' };
      } else if (oldGroupId !== selectedGroupId) {
        await ProjectService.changeGroup(assigningProject.projectId, selectedGroupId);
        return { type: 'CHANGE' };
      }
      return { type: 'NONE' };
    },
    onSuccess: ({ type }) => {
      if (type === 'ASSIGN') {
        toast.success(PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.SUCCESS_ASSIGN);
      } else if (type === 'CHANGE') {
        toast.success(PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.SUCCESS_CHANGE);
      }
      onSuccessAction();
    },
    onError: (e) => {
      const resMsg = getErrorMessage(e, PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_BACKEND);
      toast.error(PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_FAILED + resMsg);
    },
  });

  // --- HANDLERS ---

  const handleSaveProject = async (values, isDraft = true) => {
    try {
      const selectedGroupId = values.internshipGroupId;
      const selectedGroup = groups.find((g) => (g.internshipId || g.id) === selectedGroupId);
      const groupStatusStr = String(
        selectedGroup?.status || selectedGroup?.groupStatus || ''
      ).toLowerCase();
      if (
        groupStatusStr === '2' ||
        groupStatusStr === '3' ||
        groupStatusStr === 'completed' ||
        groupStatusStr === 'archived'
      ) {
        toast.warning(PROJECT_MANAGEMENT.MESSAGES.ERROR_INACTIVE_GROUP);
        return;
      }

      const opStatus = getOperationalStatus(
        editingRecord?.operationalStatus ?? editingRecord?.status
      );
      const isOperationalActive = opStatus === OPERATIONAL_STATUS.ACTIVE;

      const oldGroupId = editingRecord?.internshipId || editingRecord?.internshipGroupId;
      const isGroupChanged = selectedGroupId && oldGroupId && selectedGroupId !== oldGroupId;

      if (editingRecord && isOperationalActive) {
        const res = await ProjectService.getAssignedStudents(editingRecord.projectId).catch(
          () => null
        );
        const studentCount = res?.data?.length || 0;

        // AC-05: If group is CHANGED and has student data -> BLOCK
        if (isGroupChanged && studentCount > 0) {
          modal.error({
            title: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_NO_CHANGE || 'Không thể đổi nhóm',
            content:
              PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_HAS_DATA ||
              'Nhóm đang có dữ liệu hoạt động, không thể đổi project.',
          });
          return;
        }

        // AC-08 Case 3: If just EDITING content and has students -> WARN
        if (studentCount > 0) {
          modal.confirm({
            title: PROJECT_MANAGEMENT.MODALS?.UPDATE_WARNING_TITLE || 'Cảnh báo cập nhật',
            content: `Dự án đang có ${studentCount} sinh viên tham gia. Thay đổi có thể ảnh hưởng đến trải nghiệm học. Bạn có chắc?`,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: () => saveMutation.mutateAsync({ values, isDraft }),
          });
          return;
        }
      }
      return saveMutation.mutateAsync({ values, isDraft });
    } catch (err) {
      toast.error(MESSAGES.ERROR_UPDATE_PREVALIDATE);
    }
  };

  const handlePublishProject = (id) => {
    modal.confirm({
      title: 'Publish Project',
      content: 'Once published, you can assign students and track progress. Proceed?',
      okText: 'Publish',
      cancelText: 'Cancel',
      onOk: () => publishMutation.mutateAsync(id),
    });
  };

  const handleCompleteProject = async (record) => {
    const id = record?.projectId || record?.id || record;
    if (!id || typeof id !== 'string') {
      toast.error(MESSAGES.ERROR_GENERAL);
      return;
    }
    try {
      const projectRes = await ProjectService.getById(id);
      const projectDetail = projectRes?.data || projectRes;

      const groupId =
        projectDetail.internshipId ||
        projectDetail.internshipGroupId ||
        projectDetail.groupId ||
        record?.internshipId ||
        record?.internshipGroupId;

      const groupName =
        projectDetail.groupName ||
        projectDetail.groupInfo?.groupName ||
        record?.groupName ||
        'Unknown Group';

      let content = MESSAGES.COMPLETE_CONFIRM;
      const isValidGroupId = groupId && groupId !== '00000000-0000-0000-0000-000000000000';
      let phaseEndDate = null;

      if (isValidGroupId) {
        try {
          const groupRes = await ProjectService.getStudentsByGroup(groupId);
          const groupDetail = groupRes?.data || groupRes;
          phaseEndDate = groupDetail.endDate || groupDetail.internPhaseEnd;
        } catch (gErr) {
          // Silent catch for secondary group data
        }
      }

      if (!phaseEndDate) {
        phaseEndDate = projectDetail.endDate || record?.endDate;
      }

      if (phaseEndDate && dayjs().isBefore(dayjs(phaseEndDate))) {
        content = MESSAGES.COMPLETE_EARLY_WARNING.replace('{groupName}', groupName).replace(
          '{date}',
          dayjs(phaseEndDate).format('DD/MM/YYYY')
        );
      }

      modal.confirm({
        title: PROJECT_MANAGEMENT.MODALS?.COMPLETE_CONFIRM_TITLE,
        content,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk: () => completeMutation.mutateAsync(id),
      });
    } catch (err) {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_COMPLETE));
    }
  };

  const handleDeleteProject = async (record) => {
    const id = record?.projectId || record?.id || record;
    if (!id || typeof id !== 'string') {
      toast.error(MESSAGES.ERROR_GENERAL);
      return;
    }

    const ownerId = record?.mentorId || record?.MentorId;
    const currentUserId = userInfo?.userId || userInfo?.Id;
    const userRoleId = userInfo?.roleId || userInfo?.RoleId;

    if (userRoleId === 6 && ownerId && ownerId !== currentUserId) {
      toast.error(PROJECT_MANAGEMENT.MODALS?.DELETE_OWNERSHIP_ERROR);
      return;
    }

    try {
      const res = await ProjectService.getAssignedStudents(id).catch(() => null);
      const assignedStudents = res?.data || res || [];

      if (assignedStudents.length > 0) {
        modal.warning({
          title: PROJECT_MANAGEMENT.MODALS?.DELETE_UNABLE_TITLE,
          content: MESSAGES.ERROR_ASSIGNED_STU,
          okText: 'Got it',
        });
        return;
      }

      modal.confirm({
        title: PROJECT_MANAGEMENT.MODALS?.DELETE_CONFIRM_TITLE,
        content: MESSAGES.DELETE_CONFIRM,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => deleteMutation.mutateAsync(id),
      });
    } catch (err) {
      toast.error(getErrorMessage(err, MESSAGES.ERROR_DELETE));
    }
  };

  const handleUnpublishProject = (id) => {
    modal.confirm({
      title: 'Unpublish Project',
      content:
        'The project will be moved back to Draft and will no longer be visible to students. Proceed?',
      okText: 'Unpublish',
      cancelText: 'Cancel',
      onOk: () => unpublishMutation.mutateAsync(id),
    });
  };

  const handleArchiveProject = (id) => {
    modal.confirm({
      title: 'Archive Project',
      content: 'Archived projects are hidden by default and cannot be edited. Proceed?',
      okText: 'Archive',
      cancelText: 'Cancel',
      onOk: () => archiveMutation.mutateAsync(id),
    });
  };

  const handleAssignGroup = async (
    assigningProject,
    selectedGroupId,
    setLocalLoading,
    closeLocalModal,
    replacementProjectId // AC-05: Atomic Swap
  ) => {
    if (!selectedGroupId || !assigningProject) return;

    const oldGroupId =
      assigningProject.internshipId ||
      assigningProject.internshipGroupId ||
      assigningProject.groupId;

    const isSwapping =
      oldGroupId &&
      oldGroupId !== '00000000-0000-0000-0000-000000000000' &&
      oldGroupId !== selectedGroupId;

    const doMutate = async () => {
      setLocalLoading?.(true);
      try {
        // 1. Assign primary project to target group
        await assignGroupMutation.mutateAsync({ assigningProject, selectedGroupId });

        // 2. AC-05 Case B: If it's a swap and we have a replacement, assign it to old group
        if (isSwapping && replacementProjectId) {
          try {
            await ProjectService.assignGroup(replacementProjectId, oldGroupId);
          } catch (swapErr) {
            console.error('Replacement assignment failed:', swapErr);
            toast.warning('Primary assignment succeeded, but replacement assignment failed.');
          }
        }

        closeLocalModal?.();
      } finally {
        setLocalLoading?.(false);
      }
    };

    if (isSwapping) {
      const opStatus = getOperationalStatus(
        assigningProject.operationalStatus ?? assigningProject.status
      );
      if (opStatus === OPERATIONAL_STATUS.ACTIVE) {
        // Check student data before allowing swap
        try {
          const studentsRes = await ProjectService.getAssignedStudents(
            assigningProject.projectId
          ).catch(() => null);
          const students = studentsRes?.data || studentsRes || [];

          if (students.length > 0) {
            modal.error({
              title: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_NO_CHANGE,
              content: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_HAS_DATA,
            });
            return;
          }
        } catch {
          toast.error(MESSAGES.ERROR_CHECK_BOUNDS);
          return;
        }

        // Show confirmation
        modal.confirm({
          title: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM_CHANGE_TITLE,
          content: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM_CHANGE_DESC,
          okText: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM || 'Confirm',
          cancelText: 'Cancel',
          onOk: doMutate,
        });
        return;
      }
    }

    // No confirmation needed for new assign
    doMutate();
  };

  const submitLoading =
    saveMutation.isPending ||
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    archiveMutation.isPending ||
    completeMutation.isPending ||
    deleteMutation.isPending ||
    assignGroupMutation.isPending;

  return {
    submitLoading,
    handleSaveProject,
    handlePublishProject,
    handleUnpublishProject,
    handleCompleteProject,
    handleArchiveProject,
    handleAssignGroup,
    handleDeleteProject,
  };
};
