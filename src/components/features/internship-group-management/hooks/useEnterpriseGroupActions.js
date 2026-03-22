import { useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useEnterpriseGroupActions = (onSuccess) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { MESSAGES } = ENTERPRISE_GROUP_UI;

  const handleAction = async (actionFn, successMessage) => {
    try {
      setLoading(true);
      await actionFn();
      toast.success(successMessage);
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Group Action Error:', error);
      // For constraint errors like deleting group with students
      const errorMsg = error.response?.data?.message || error.message || MESSAGES.ERROR;
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createGroup = (data) =>
    handleAction(() => EnterpriseGroupService.createGroup(data), MESSAGES.CREATE_SUCCESS);

  const updateGroup = (id, data) =>
    handleAction(() => EnterpriseGroupService.updateGroup(id, data), MESSAGES.UPDATE_SUCCESS);

  const archiveGroup = (id) =>
    handleAction(() => EnterpriseGroupService.archiveGroup(id), MESSAGES.ARCHIVE_SUCCESS);

  const assignMentor = (id, mentorId) =>
    handleAction(() => EnterpriseGroupService.assignMentor(id, mentorId), MESSAGES.UPDATE_SUCCESS);

  const addStudents = (id, studentIds) =>
    handleAction(
      () => EnterpriseGroupService.addStudents(id, studentIds),
      MESSAGES.ADD_STUDENT_SUCCESS
    );

  const removeStudent = (id, studentId) =>
    handleAction(
      () => EnterpriseGroupService.removeStudent(id, studentId),
      MESSAGES.REMOVE_STUDENT_SUCCESS
    );

  const deleteGroup = async (id, memberCount) => {
    if (memberCount > 0) {
      toast.error(MESSAGES.DELETE_ERROR_HAS_STUDENTS);
      return false;
    }
    return handleAction(() => EnterpriseGroupService.deleteGroup(id), MESSAGES.DELETE_SUCCESS);
  };

  return {
    loading,
    createGroup,
    updateGroup,
    archiveGroup,
    assignMentor,
    addStudents,
    removeStudent,
    deleteGroup,
  };
};
