'use client';

import { App } from 'antd';
import { useState } from 'react';

import {
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
} from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';

export const useProjectActions = ({ editingRecord, fetchData, groups, setModalVisible }) => {
  const { modal } = App.useApp();
  const toast = useToast();
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

      // AC-02/AC-13: Cannot publish without a group
      if (!isDraft && !values.internshipGroupId) {
        toast.error(MESSAGES.ERROR_PUBLISH_NO_GROUP);
        return;
      }

      if (editingRecord) {
        // PER BACKEND: UpdateProject expects JSON (application/json)
        // and does not currently support Links or Files in the Command DTO.
        const updatePayload = {
          internshipId: values.internshipGroupId,
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

        // If updating a Draft and clicking Publish
        if (!isDraft && editingRecord.status === PROJECT_STATUS.DRAFT) {
          await ProjectService.publish(editingRecord.projectId);
        }
        toast.success(MESSAGES.UPDATE_SUCCESS);
      } else {
        // PER BACKEND: CreateProject expects FormData (multipart/form-data)
        // to support initial file attachments.
        const formData = new FormData();
        if (values.internshipGroupId) {
          formData.append('InternshipId', values.internshipGroupId);
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
              formData.append(`Links[${index}].resourceName`, link.title || '');
              formData.append(`Links[${index}].url`, link.url);
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

        // Initial status
        formData.append('Status', isDraft ? 0 : 1);

        const res = await ProjectService.create(formData);
        const newProject = res?.data || res;

        // If creating and clicking Publish immediately
        if (!isDraft && newProject?.projectId) {
          await ProjectService.publish(newProject.projectId);
        }
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
