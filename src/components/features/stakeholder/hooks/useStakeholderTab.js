'use client';

import { useEffect, useState, useCallback } from 'react';
import { StakeholderService } from '@/components/features/stakeholder/services/stakeholder';
import { useToast } from '@/providers/ToastProvider';
import { ProjectService } from '@/components/features/project/services/projectService';
import { STAKEHOLDER_MESSAGES } from '@/constants/stakeholder/messages';

export function useStakeholderTab() {
  const toast = useToast();
  const [projectId, setProjectId] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderLoading, setStakeholderLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [internshipId, setInternshipId] = useState(null);
  const [openStakeholderForm, setOpenStakeholderForm] = useState(false);
  const [editingStakeholderId, setEditingStakeholderId] = useState(null);
  const [stakeholderForm, setStakeholderForm] = useState({
    name: '',
    type: 'Real',
    role: '',
    description: '',
    email: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const validateForm = () => {
    const newErrors = {};

    if (!stakeholderForm.name?.trim()) {
      newErrors.name = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.NAME;
    } else if (stakeholderForm.name.length > 200) {
      newErrors.name = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.NAME_MAX_LENGTH;
    }

    if (!stakeholderForm.email?.trim()) {
      newErrors.email = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.EMAIL;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(stakeholderForm.email)) {
      newErrors.email = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.EMAIL_INVALID;
    } else if (stakeholderForm.email.length > 150) {
      newErrors.email = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.EMAIL_MAX_LENGTH;
    }

    if (stakeholderForm.role && stakeholderForm.role.length > 100) {
      newErrors.role = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.ROLE_MAX_LENGTH;
    }

    if (stakeholderForm.description && stakeholderForm.description.length > 500) {
      newErrors.description = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.DESCRIPTION_MAX_LENGTH;
    }

    if (stakeholderForm.phoneNumber) {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(stakeholderForm.phoneNumber)) {
        newErrors.phoneNumber = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.PHONE_INVALID;
      } else if (stakeholderForm.phoneNumber.length > 15) {
        newErrors.phoneNumber = STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.PHONE_MAX_LENGTH;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveStakeholder = async () => {
    if (!editingStakeholderId) {
      if (!validateForm()) {
        return;
      }
    } else {
      if (!stakeholderForm.name || !stakeholderForm.email) {
        toast.warning(STAKEHOLDER_MESSAGES.REQUIRED_FIELDS.GENERAL);
        return;
      }
    }

    if (!internshipId) {
      toast.error(STAKEHOLDER_MESSAGES.PROJECT_NOT_FOUND);
      return;
    }

    const payload = {
      internshipId,
      ...stakeholderForm,
    };

    try {
      let res;
      if (editingStakeholderId) {
        res = await StakeholderService.update(editingStakeholderId, payload);
      } else {
        res = await StakeholderService.create(payload);
      }

      // httpClient returns { isSuccess: false, status, data } on error
      if (res && res.isSuccess !== false && res.statusCode !== 403) {
        toast.success(
          editingStakeholderId
            ? STAKEHOLDER_MESSAGES.UPDATE_SUCCESS
            : STAKEHOLDER_MESSAGES.CREATE_SUCCESS,
        );
        setOpenStakeholderForm(false);
        setEditingStakeholderId(null);
        setStakeholderForm({
          name: '',
          type: 'Real',
          role: '',
          description: '',
          email: '',
          phoneNumber: '',
        });
        setErrors({});
        fetchStakeholders();
      } else {
        // Handle specific error codes
        const errorMsg =
          res?.data?.errors?.[0] ||
          res?.errors?.[0] ||
          res?.message ||
          STAKEHOLDER_MESSAGES.SAVE_FAILED;

        if (res?.status === 403 || res?.statusCode === 403) {
          toast.error(errorMsg || STAKEHOLDER_MESSAGES.FORBIDDEN);
        } else if (res?.status === 409 || res?.statusCode === 409) {
          toast.warning(STAKEHOLDER_MESSAGES.EMAIL_EXIST);
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      console.error('Error saving stakeholder:', err);
      toast.error(STAKEHOLDER_MESSAGES.SAVE_FAILED);
    }
  };

  const handleDeleteStakeholder = async (id) => {
    try {
      const res = await StakeholderService.remove(id, internshipId);
      if (res && res.isSuccess !== false && res.statusCode !== 403) {
        toast.success(STAKEHOLDER_MESSAGES.DELETE_SUCCESS);
        fetchStakeholders();
      } else {
        const errorMsg =
          res?.data?.errors?.[0] ||
          res?.errors?.[0] ||
          res?.message ||
          STAKEHOLDER_MESSAGES.DELETE_FAILED;

        if (res?.status === 403 || res?.statusCode === 403) {
          toast.error(errorMsg || STAKEHOLDER_MESSAGES.FORBIDDEN);
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
      toast.error(STAKEHOLDER_MESSAGES.DELETE_FAILED);
    }
  };

  const fetchStakeholders = useCallback(async () => {
    if (!internshipId) return;

    try {
      setStakeholderLoading(true);

      const params = {
        PageNumber: page,
        PageSize: pageSize,
      };

      if (debouncedSearch?.trim()) {
        params.SearchTerm = debouncedSearch.trim();
      }

      const res = await StakeholderService.getByProject(internshipId, params);

      if (res?.data?.items) {
        setStakeholders(res.data.items);
        setTotal(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {
      toast.error(STAKEHOLDER_MESSAGES.LOAD_FAILED);
    } finally {
      setStakeholderLoading(false);
    }
  }, [internshipId, debouncedSearch, page, pageSize, toast]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({
          PageNumber: 1,
          PageSize: 1,
        });

        if (res?.data?.items?.length > 0) {
          const project = res.data.items[0];

          setProjectId(project.projectId);
          setInternshipId(project.internshipId);
        }
      } catch {
        toast.error(STAKEHOLDER_MESSAGES.PROJECT_NOT_FOUND);
      }
    };

    fetchProjectId();
  }, [toast]);

  useEffect(() => {
    fetchStakeholders();
  }, [fetchStakeholders]);

  return {
    projectId,
    stakeholders,
    stakeholderLoading,
    search,
    setSearch,
    internshipId,
    openStakeholderForm,
    setOpenStakeholderForm,
    editingStakeholderId,
    setEditingStakeholderId,
    stakeholderForm,
    setStakeholderForm,
    errors,
    setErrors,
    handleSaveStakeholder,
    handleDeleteStakeholder,
    fetchStakeholders,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
  };
}
