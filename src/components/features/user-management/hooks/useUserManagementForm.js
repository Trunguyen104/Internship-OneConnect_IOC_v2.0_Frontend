'use client';

import { useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/userService';
import { userManagementService } from '@/components/features/user-management/userManagement.service';
import { USER_ROLE } from '@/constants/user-management/enums';
import { getErrorMessage } from '@/lib/error';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { universityService } from '@/services/university.service';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

export function isUniversityRole(role) {
  return role === USER_ROLE.SCHOOL_ADMIN || role === USER_ROLE.STUDENT;
}

export function isEnterpriseRole(role) {
  return role === USER_ROLE.ENTERPRISE_ADMIN || role === USER_ROLE.HR || role === USER_ROLE.MENTOR;
}

export function unitRequired(role) {
  return isUniversityRole(role) || isEnterpriseRole(role);
}

export function useUserManagementForm(onSuccess) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  // States for dynamic data
  const [role, setRole] = useState(USER_ROLE.STUDENT);
  const [universities, setUniversities] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [fetchingUnits, setFetchingUnits] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      setFetchingUnits(true);
      try {
        const [uniRes, entRes, meRes] = await Promise.all([
          universityService.getAll({ PageNumber: 1, PageSize: 1000 }),
          enterpriseService.getAll({ PageNumber: 1, PageSize: 1000 }),
          userService.getMe(),
        ]);

        const uniData = uniRes?.data?.items ?? uniRes?.items ?? [];
        const entData = entRes?.data?.items ?? entRes?.items ?? [];
        const meData = meRes?.data || meRes;

        setUniversities(uniData);
        setEnterprises(entData);
        setCurrentUser(meData);

        // Hierarchical defaults
        if (meData?.role === USER_ROLE.SCHOOL_ADMIN) {
          setRole(USER_ROLE.STUDENT);
          setUnitId(meData.universityId || meData.unitId || '');
        } else if (meData?.role === USER_ROLE.ENTERPRISE_ADMIN) {
          setRole(USER_ROLE.HR);
          setUnitId(meData.enterpriseId || meData.unitId || '');
        } else {
          setRole(USER_ROLE.STUDENT);
        }
      } catch (err) {
        console.error('Failed to initialize form', err);
      } finally {
        setFetchingUnits(false);
      }
    };
    initForm();
  }, []);

  const allowedRoles = (() => {
    if (!currentUser) return [];
    const currRole = currentUser.role;

    if (currRole === USER_ROLE.SUPER_ADMIN || currRole === USER_ROLE.MODERATOR) {
      return Object.values(USER_ROLE);
    }
    if (currRole === USER_ROLE.SCHOOL_ADMIN) {
      return [USER_ROLE.STUDENT];
    }
    if (currRole === USER_ROLE.ENTERPRISE_ADMIN) {
      return [USER_ROLE.HR, USER_ROLE.MENTOR];
    }
    return [];
  })();

  const isUnitLocked =
    currentUser?.role === USER_ROLE.SCHOOL_ADMIN ||
    currentUser?.role === USER_ROLE.ENTERPRISE_ADMIN;

  const currentUnits = isUniversityRole(role)
    ? universities
    : isEnterpriseRole(role)
      ? enterprises
      : [];

  const unitLabel = isUniversityRole(role)
    ? 'University'
    : isEnterpriseRole(role)
      ? 'Enterprise'
      : 'Unit';

  const validate = (payload) => {
    const nextErrors = {};
    if (!payload.fullName) nextErrors.fullName = 'Full name is required';
    if (!payload.email) nextErrors.email = 'Email is required';
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = 'Invalid email';
    }
    if (unitRequired(payload.role) && !payload.unitId) {
      nextErrors.unitId = `Please select a ${unitLabel.toLowerCase()}`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      role: Number(role),
      phoneNumber: String(formData.get('phoneNumber') || '').trim() || undefined,
      unitId: unitRequired(Number(role)) ? unitId : undefined,
    };

    if (!validate(payload)) {
      setLoading(false);
      return;
    }

    try {
      await userManagementService.create(payload);
      useAdminUsersStore.increment();
      onSuccess?.();
      toast.success('Successfully created');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    setRole,
    unitId,
    setUnitId,
    currentUser,
    currentUnits,
    fetchingUnits,
    loading,
    allowedRoles,
    isUnitLocked,
    unitLabel,
    errors,
    handleSubmit,
  };
}
