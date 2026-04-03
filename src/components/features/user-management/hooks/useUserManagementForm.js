'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { USER_ROLE } from '@/constants/user-management/enums';
import { getErrorMessage } from '@/lib/error';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { httpGet } from '@/services/http-client.service';
import { universityService } from '@/services/university.service';
import { userManagementService } from '@/services/user-management.service';
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
  const [termId, setTermId] = useState('');
  const [terms, setTerms] = useState([]);
  const [fetchingUnits, setFetchingUnits] = useState(false);
  const [fetchingTerms, setFetchingTerms] = useState(false);

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

  // Fetch terms when a University is selected for a Student
  useEffect(() => {
    if (!isUniversityRole(role) || !unitId) {
      setTerms([]);
      setTermId('');
      return;
    }
    let alive = true;
    setFetchingTerms(true);
    httpGet('/terms', { UniversityId: unitId, PageNumber: 1, PageSize: 100 })
      .then((res) => {
        if (!alive) return;
        const items = res?.data?.items ?? res?.items ?? [];
        setTerms(items);
      })
      .catch(() => {
        if (alive) setTerms([]);
      })
      .finally(() => {
        if (alive) setFetchingTerms(false);
      });
    return () => {
      alive = false;
    };
  }, [role, unitId]);

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
      if (!payload.fullName) nextErrors.fullName = UI_TEXT.USER_MANAGEMENT.ERR_FULL_NAME_REQ;
      if (!payload.email) nextErrors.email = UI_TEXT.USER_MANAGEMENT.ERR_EMAIL_REQ;
      if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        nextErrors.email = UI_TEXT.USER_MANAGEMENT.ERR_INVALID_EMAIL;
      }
      if (!payload.role) {
        nextErrors.role = 'Please select an assigned role';
      }
      if (unitRequired(payload.role) && !payload.unitId) {
        nextErrors.unitId = `Please select a ${unitLabel?.toLowerCase() || 'unit'}`;
      }
      if (payload.role === USER_ROLE.STUDENT && !payload.termId) {
        nextErrors.termId = UI_TEXT.USER_MANAGEMENT.TERM_PLACEHOLDER_SELECT;
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    },
    [unitLabel]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const currentRole = Number(role);

      const payload = {
        fullName: String(formData.get('fullName') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        role: currentRole,
        phoneNumber: String(formData.get('phoneNumber') || '').trim() || undefined,
        unitId: unitRequired(currentRole) ? unitId || undefined : undefined,
        termId: currentRole === USER_ROLE.STUDENT ? termId || undefined : undefined,
      };

      if (!validate(payload)) {
        return;
      }

      setLoading(true);
      try {
        await userManagementService.create(payload);
        useAdminUsersStore.increment();
        onSuccess?.();
        toast.success('User successfully created');
      } catch (err) {
        console.error('Create user error:', err);
        toast.error(getErrorMessage(err) || 'Failed to create user. Please check your information');
      } finally {
        setLoading(false);
      }
    },
    [role, unitId, termId, onSuccess, toast, validate]
  );

  return {
    role,
    setRole,
    unitId,
    setUnitId,
    termId,
    setTermId,
    terms,
    fetchingTerms,
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
