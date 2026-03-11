'use client';

import { useEffect, useState, useCallback } from 'react';
import { StakeholderService } from '@/services/stakeholder';
import { useToast } from '@/providers/ToastProvider';
import { ProjectService } from '@/services/projectService';
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
      if (editingStakeholderId) {
        await StakeholderService.update(editingStakeholderId, payload);
        toast.success(STAKEHOLDER_MESSAGES.UPDATE_SUCCESS);
      } else {
        await StakeholderService.create(payload);
        toast.success(STAKEHOLDER_MESSAGES.CREATE_SUCCESS);
      }

      setOpenStakeholderForm(false);
      setEditingStakeholderId(null);
      setStakeholderForm({
        name: '',
        type: 0,
        role: '',
        description: '',
        email: '',
        phoneNumber: '',
      });
      setErrors({});
      fetchStakeholders();
    } catch (err) {
      if (err.message?.includes('409')) {
        toast.warning(STAKEHOLDER_MESSAGES.EMAIL_EXIST);
      } else {
        toast.error(STAKEHOLDER_MESSAGES.SAVE_FAILED);
      }
    }
  };

  const handleDeleteStakeholder = async (id) => {
    try {
      await StakeholderService.remove(id, internshipId);
      toast.success(STAKEHOLDER_MESSAGES.DELETE_SUCCESS);
      fetchStakeholders();
    } catch {
      toast.error(STAKEHOLDER_MESSAGES.DELETE_FAILED);
    }
  };

  const fetchStakeholders = useCallback(async () => {
    if (!internshipId) return;

    try {
      setStakeholderLoading(true);

      const params = {};
      if (debouncedSearch?.trim()) {
        params.SearchTerm = debouncedSearch.trim();
      }

      const res = await StakeholderService.getByProject(internshipId, params);

      if (res?.data?.items) {
        setStakeholders(res.data.items);
      }
    } catch {
      toast.error(STAKEHOLDER_MESSAGES.LOAD_FAILED);
    } finally {
      setStakeholderLoading(false);
    }
  }, [internshipId, debouncedSearch, toast]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
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
  };
}
