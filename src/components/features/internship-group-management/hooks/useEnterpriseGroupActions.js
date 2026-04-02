import { useMutation, useQueryClient } from '@tanstack/react-query';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useEnterpriseGroupActions = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const { MESSAGES, REFRESH_EVENT } = GROUP_MANAGEMENT;

  const handleSuccess = (message) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['enterprise-groups'] });
    queryClient.invalidateQueries({ queryKey: ['enterprise-group-detail'] });
    queryClient.invalidateQueries({ queryKey: ['internship-students'] });
    queryClient.invalidateQueries({ queryKey: ['unassigned-students'] });
    window.dispatchEvent(new CustomEvent(REFRESH_EVENT || 'INTERNSHIP_GROUP_REFRESH'));
  };

  const createMutation = useMutation({
    mutationFn: (data) => EnterpriseGroupService.createGroup(data),
    onSuccess: () => handleSuccess(MESSAGES.CREATE_SUCCESS),
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.ERROR)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => EnterpriseGroupService.updateGroup(id, data),
    onSuccess: () => handleSuccess(MESSAGES.UPDATE_SUCCESS),
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.ERROR)),
  });

  const archiveMutation = useMutation({
    mutationFn: (id) => EnterpriseGroupService.archiveGroup(id),
    onSuccess: () => handleSuccess(MESSAGES.ARCHIVE_SUCCESS),
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.ERROR)),
  });

  const addStudentsMutation = useMutation({
    mutationFn: ({ id, students }) => EnterpriseGroupService.addStudents(id, students),
    onSuccess: () => handleSuccess(MESSAGES.ADD_STUDENT_SUCCESS || 'Students added successfully'),
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.ERROR)),
  });

  const removeStudentsMutation = useMutation({
    mutationFn: ({ id, studentIds }) => EnterpriseGroupService.removeStudents(id, studentIds),
    onSuccess: () =>
      handleSuccess(MESSAGES.REMOVE_STUDENT_SUCCESS || 'Students removed successfully'),
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.ERROR)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => EnterpriseGroupService.deleteGroup(id),
    onSuccess: () => handleSuccess(MESSAGES.DELETE_SUCCESS),
    onError: (error) => {
      const errorMsg = error?.message || '';
      if (
        error?.status === 400 ||
        errorMsg.toLowerCase().includes('data') ||
        errorMsg.toLowerCase().includes('relation')
      ) {
        toast.warning(MESSAGES.DELETE_ERROR_HAS_DATA, { duration: 6 });
      } else {
        toast.error(getErrorDetail(error, MESSAGES.ERROR));
      }
    },
  });

  return {
    loading:
      createMutation.isPending ||
      updateMutation.isPending ||
      archiveMutation.isPending ||
      addStudentsMutation.isPending ||
      removeStudentsMutation.isPending ||
      deleteMutation.isPending,
    createGroup: createMutation.mutateAsync,
    updateGroup: (id, data) => updateMutation.mutateAsync({ id, data }),
    archiveGroup: archiveMutation.mutateAsync,
    addStudents: (id, students) => addStudentsMutation.mutateAsync({ id, students }),
    removeStudents: (id, studentIds) => removeStudentsMutation.mutateAsync({ id, studentIds }),
    deleteGroup: deleteMutation.mutateAsync,
  };
};
