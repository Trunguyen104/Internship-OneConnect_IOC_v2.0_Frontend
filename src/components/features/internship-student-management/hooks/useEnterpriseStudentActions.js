import { useState } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { ENTERPRISE_STUDENT_UI } from '../constants/enterprise-student.constants';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useEnterpriseStudentActions = (onSuccess) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const acceptApplication = async (applicationId) => {
    try {
      setLoading(true);
      await EnterpriseStudentService.acceptApplication(applicationId);
      toast.success(ENTERPRISE_STUDENT_UI.MESSAGES.ACCEPT_SUCCESS);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Accept Application Error:', error);
      toast.error(getErrorDetail(error, ENTERPRISE_STUDENT_UI.MESSAGES.ACCEPT_ERROR));
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async (applicationId, reason) => {
    if (!reason || !reason.trim()) {
      toast.error(ENTERPRISE_STUDENT_UI.MODALS.REJECT.REASON_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      await EnterpriseStudentService.rejectApplication(applicationId, reason);
      toast.success(ENTERPRISE_STUDENT_UI.MESSAGES.REJECT_SUCCESS);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Reject Application Error:', error);
      toast.error(getErrorDetail(error, ENTERPRISE_STUDENT_UI.MESSAGES.REJECT_ERROR));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    acceptApplication,
    rejectApplication,
  };
};
