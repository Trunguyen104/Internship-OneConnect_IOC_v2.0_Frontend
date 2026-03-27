'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { userManagementService } from '@/components/features/user-management/user-management.service';
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

const ROLE_MAP = {
  SuperAdmin: 1,
  Moderator: 2,
  SchoolAdmin: 3,
  EnterpriseAdmin: 4,
  HR: 5,
  Mentor: 6,
  Student: 7,
};

function parseRole(role) {
  if (!role) return 0;
  if (typeof role === 'number') return role;
  if (!isNaN(Number(role))) return Number(role);
  return ROLE_MAP[role] || 0;
}

export function useUserManagementForm(onSuccess) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  // States for dynamic data
  const [role, setRole] = useState(0);
  const [universities, setUniversities] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [fetchingUnits, setFetchingUnits] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      setFetchingUnits(true);
      try {
        const meRes = await userService.getMe();
        const meData = meRes?.data || meRes?.Data || meRes;
        setCurrentUser(meData);

        const rawRole = meData?.role || meData?.Role;
        const meRole = parseRole(rawRole);

        let uniData = [];
        let entData = [];

        if (meRole === USER_ROLE.SUPER_ADMIN || meRole === USER_ROLE.MODERATOR) {
          const [uniRes, entRes] = await Promise.all([
            universityService.getAll({ PageNumber: 1, PageSize: 1000 }),
            enterpriseService.getAll({ PageNumber: 1, PageSize: 1000 }),
          ]);
          uniData = uniRes?.data?.items ?? uniRes?.items ?? [];
          entData = entRes?.data?.items ?? entRes?.items ?? [];
        }

        setUniversities(uniData);
        setEnterprises(entData);

        if (meRole === USER_ROLE.SCHOOL_ADMIN) {
          setRole(USER_ROLE.STUDENT);
          setUnitId(
            meData.universityId || meData.UniversityId || meData.unitId || meData.UnitId || ''
          );
        } else if (meRole === USER_ROLE.ENTERPRISE_ADMIN) {
          setRole(USER_ROLE.HR);
          setUnitId(
            meData.enterpriseId || meData.EnterpriseId || meData.unitId || meData.UnitId || ''
          );
        } else if (meRole === USER_ROLE.SUPER_ADMIN || meRole === USER_ROLE.MODERATOR) {
          setRole(USER_ROLE.STUDENT);
          setUnitId('');
        } else {
          setRole(0);
        }
      } catch (err) {
        console.error('Failed to initialize form', err);
        if (err.status !== 403) {
          toast.error(getErrorMessage(err) || 'Failed to load user info');
        }
      } finally {
        setFetchingUnits(false);
      }
    };
    initForm();
  }, [toast]);

  const allowedRoles = (() => {
    if (!currentUser) return [];
    const currRole = parseRole(currentUser.role || currentUser.Role);

    if (currRole === USER_ROLE.SUPER_ADMIN || currRole === USER_ROLE.MODERATOR) {
      return Object.values(USER_ROLE).filter((v) => typeof v === 'number');
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
    parseRole(currentUser?.role || currentUser?.Role) === USER_ROLE.SCHOOL_ADMIN ||
    parseRole(currentUser?.role || currentUser?.Role) === USER_ROLE.ENTERPRISE_ADMIN;

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

  const validate = useCallback(
    (payload) => {
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
    },
    [unitLabel]
  );

  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [role, unitId, onSuccess, toast, validate]
  );

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
