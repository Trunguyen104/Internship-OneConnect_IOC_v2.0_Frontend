'use client';

import { App } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import {
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
  const [submitLoading, setSubmitLoading] = useState(false);
  const { MESSAGES } = PROJECT_MANAGEMENT;

  const getErrorMessage = (err, defaultMsg) => {
    const resMsg = err.data?.errors?.[0] || err.data?.message || err.message;

    if (resMsg?.includes(MESSAGES.ERROR_PUBLISH_NO_GROUP_VN)) {
      return MESSAGES.ERROR_PUBLISH_NO_GROUP;
    }

    return resMsg || defaultMsg;
  };

  const executeSave = async (values, isDraft) => {
    try {
      setSubmitLoading(true);

      // AC-02: Intern Group is optional even when publishing. Group can be assigned later (AC-04).

      if (editingRecord) {
        // PER BACKEND: UpdateProject expects JSON (application/json)
        // and does not currently support Links or Files in the Command DTO.
        const oldGroupId = editingRecord.internshipId || editingRecord.internshipGroupId;
        const newGroupId = values.internshipGroupId;
        const isAssigning =
          newGroupId && (!oldGroupId || oldGroupId === '00000000-0000-0000-0000-000000000000');
        const isSwapping =
          newGroupId &&
          oldGroupId &&
          oldGroupId !== '00000000-0000-0000-0000-000000000000' &&
          oldGroupId !== newGroupId;

        // Backend UpdateProject does not handle group changes natively per AC,
        // so we exclude internshipId or just send it as is, treating it as basic info update.
        const updatePayload = {
          projectName: values.name,
          description: values.description,
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
          field: values.field || '',
          requirements: values.requirements || '',
          deliverables: values.deliverables || '',
          template: values.template ?? 2,
        };

        await ProjectService.update(editingRecord.projectId, updatePayload);

        // Transition group separately based on action
        if (isAssigning) {
          await ProjectService.assignGroup(editingRecord.projectId, newGroupId);
        } else if (isSwapping) {
          await ProjectService.changeGroup(editingRecord.projectId, newGroupId);
        }

        // If updating a Draft and clicking Publish (explicit save)
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
        toast.success(MESSAGES.UPDATE_SUCCESS);
      } else {
        // PER BACKEND: CreateProject expects FormData (multipart/form-data)
        // to support initial file attachments.
        const formData = new FormData();
        if (values.internshipGroupId) {
          // Exactly matches C# CreateProjectCommand property
          formData.append('InternshipGroupId', values.internshipGroupId);
        }
        formData.append('ProjectName', values.name);
        if (values.code) {
          formData.append('ProjectCode', values.code);
        }
        if (values.description) {
          formData.append('Description', values.description);
        }
        if (values.startDate) {
          formData.append('StartDate', values.startDate.toISOString());
        }
        if (values.endDate) {
          formData.append('EndDate', values.endDate.toISOString());
        }
        formData.append('Field', values.field || '');
        formData.append('Requirements', values.requirements || '');
        if (values.deliverables) {
          formData.append('Deliverables', values.deliverables);
        }
        formData.append('Template', values.template ?? 2);

        // Add Links for Create only (backend supports it in Create DTO)
        if (values.links && values.links.length > 0) {
          values.links.forEach((link, index) => {
            if (link.url) {
              formData.append(`Links[${index}].ResourceName`, link.title || link.url);
              formData.append(`Links[${index}].Url`, link.url);
            }
          });
        }

        // Add Files for Create only
        if (values.attachments && values.attachments.length > 0) {
          values.attachments.forEach((file) => {
            if (file.originFileObj) {
              formData.append('Files', file.originFileObj);
            }
          });
        }

        // Initial status and atomic publish flag per AC test plan
        formData.append('Status', isDraft ? 0 : 1);
        formData.append('PublishOnSave', isDraft ? false : true);

        const res = await ProjectService.create(formData);

        // Extract ID robustly
        const newId = res?.projectId || res?.id || (typeof res === 'string' ? res : null);

        // Success - C# Backend atomically sets PublishOnSave so we don't need a second API call
        toast.success(
          isDraft ? 'Đã lưu bản nháp tự động.' : 'Dự án đã được lưu và công bố thành công.'
        );
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

      // AC-08 Case 3: Active, group đã có student
      const isOperationalActive =
        editingRecord?.operationalStatus === 1 || editingRecord?.status === 1;

      if (editingRecord && isOperationalActive) {
        setSubmitLoading(true);
        try {
          const res = await ProjectService.getAssignedStudents(editingRecord.projectId);
          const studentCount = res?.data?.length || 0;

          if (studentCount > 0) {
            modal.confirm({
              title: 'Cảnh báo cập nhật dự án',
              content: MESSAGES.EDIT_WARNING.replace('{count}', studentCount),
              okText: 'Xác nhận',
              cancelText: 'Hủy',
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
    const id = record?.projectId || record?.id || record;
    if (!id || typeof id !== 'string') {
      toast.error('Project ID is missing or invalid');
      return;
    }
    try {
      setOverallLoading?.(true);
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

      // AC-09 Logic: If phase end is in future -> Warn
      let content = MESSAGES.COMPLETE_CONFIRM;
      const isValidGroupId = groupId && groupId !== '00000000-0000-0000-0000-000000000000';

      let phaseEndDate = null;

      if (isValidGroupId) {
        try {
          const groupRes = await ProjectService.getStudentsByGroup(groupId);
          const groupDetail = groupRes?.data || groupRes;
          phaseEndDate = groupDetail.endDate || groupDetail.internPhaseEnd;
        } catch (gErr) {
          console.warn('Failed to fetch group details, falling back to project end date:', gErr);
        }
      }

      // Fallback to project's own dates if group fetch failed or returned nothing
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
        title: 'Xác nhận hoàn thành dự án',
        content,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
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
    const id = record?.projectId || record?.id || record;
    if (!id || typeof id !== 'string') {
      toast.error('Project ID is missing or invalid');
      return;
    }

    // AC-11 Check: Mentor ownership
    const ownerId = record?.mentorId || record?.MentorId;
    const currentUserId = userInfo?.userId || userInfo?.Id;
    const userRoleId = userInfo?.roleId || userInfo?.RoleId;

    if (userRoleId === 6 && ownerId && ownerId !== currentUserId) {
      toast.error('Bạn chỉ có thể xóa các dự án do chính mình tạo.');
      return;
    }

    try {
      setOverallLoading?.(true);
      // Case 3: Check for student data
      const res = await ProjectService.getAssignedStudents(id);
      const assignedStudents = res?.data || res || [];
      const studentCount = assignedStudents.length;

      if (studentCount > 0) {
        modal.warning({
          title: 'Không thể xóa dự án',
          content: MESSAGES.ERROR_ASSIGNED_STU,
          okText: 'Đã hiểu',
        });
        return;
      }

      // Case 1 & 2: Confirm -> Delete
      modal.confirm({
        title: 'Xác nhận xóa dự án',
        content: MESSAGES.DELETE_CONFIRM,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
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

  const handleUnpublishProject = (id) => {
    modal.confirm({
      title: 'Unpublish Project',
      content:
        'The project will be moved back to Draft and will no longer be visible to students. Proceed?',
      okText: 'Unpublish',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await ProjectService.unpublish(id);
          toast.success('Project unpublished successfully.');
          fetchData();
        } catch (err) {
          toast.error(getErrorMessage(err, 'Failed to unpublish project'));
        }
      },
    });
  };

  const handleArchiveProject = (id) => {
    modal.confirm({
      title: 'Archive Project',
      content: 'Archived projects are hidden by default and cannot be edited. Proceed?',
      okText: 'Archive',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await ProjectService.archive(id);
          toast.success('Project archived successfully.');
          fetchData();
        } catch (err) {
          toast.error(getErrorMessage(err, 'Failed to archive project'));
        }
      },
    });
  };

  const handleAssignGroup = async (
    assigningProject,
    selectedGroupId,
    setLocalLoading,
    closeLocalModal
  ) => {
    if (!selectedGroupId || !assigningProject) return;

    setLocalLoading?.(true);
    try {
      const oldGroupId =
        assigningProject.internshipId ||
        assigningProject.internshipGroupId ||
        assigningProject.groupId;

      // Case 1: Initial Assignment (No previous group)
      if (!oldGroupId || oldGroupId === '00000000-0000-0000-0000-000000000000') {
        await ProjectService.assignGroup(assigningProject.projectId, selectedGroupId);
        toast.success(PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.SUCCESS_ASSIGN);
      }
      // Case 2: Group Swap
      else if (oldGroupId !== selectedGroupId) {
        const opStatus = assigningProject.operationalStatus;

        // AC-05 Swap Constraints: Check for student data if Active
        if (opStatus === OPERATIONAL_STATUS.ACTIVE) {
          const studentsRes = await ProjectService.getAssignedStudents(assigningProject.projectId);
          const students = studentsRes.data || studentsRes || [];

          if (students.length > 0) {
            modal.error({
              title: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_NO_CHANGE,
              content: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_HAS_DATA,
            });
            return;
          }

          // No student data, ask for confirmation
          await new Promise((resolve, reject) => {
            modal.confirm({
              title: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM_CHANGE_TITLE,
              content: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM_CHANGE_DESC,
              onOk: resolve,
              onCancel: () => reject('cancelled'),
            });
          });
        }

        // Proceed with swap for Active (confirmed) or Completed projects
        await ProjectService.changeGroup(assigningProject.projectId, selectedGroupId);
        toast.success(PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.SUCCESS_CHANGE);
      }

      closeLocalModal?.();
      fetchData();
    } catch (e) {
      if (e !== 'cancelled') {
        const resMsg = getErrorMessage(e, PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_BACKEND);
        toast.error(PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.ERROR_FAILED + resMsg);
      }
    } finally {
      setLocalLoading?.(false);
    }
  };

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
