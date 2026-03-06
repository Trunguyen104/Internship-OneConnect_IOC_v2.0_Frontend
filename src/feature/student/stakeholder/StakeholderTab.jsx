'use client';

import { useEffect, useState, useCallback } from 'react';
import SearchBar from '@/shared/components/SearchBar';
import { StakeholderService } from '@/services/stakeholder';
import { useToast } from '@/providers/ToastProvider';
import { STAKEHOLDER_MESSAGES } from '@/constants/stakeholder/messages';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  InboxOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { ProjectService } from '@/services/projectService';

export default function StakeholderTab() {
  const toast = useToast();
  const [projectId, setProjectId] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderLoading, setStakeholderLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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

    if (!projectId) {
      toast.error(STAKEHOLDER_MESSAGES.PROJECT_NOT_FOUND);
      return;
    }

    const payload = {
      projectId,
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
        type: 'Real',
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
      await StakeholderService.remove(id);
      toast.success(STAKEHOLDER_MESSAGES.DELETE_SUCCESS);
      fetchStakeholders();
    } catch {
      toast.error(STAKEHOLDER_MESSAGES.DELETE_FAILED);
    }
  };

  const fetchStakeholders = useCallback(async () => {
    if (!projectId) return;

    try {
      setStakeholderLoading(true);

      const params = {};
      if (debouncedSearch?.trim()) {
        params.SearchTerm = debouncedSearch.trim();
      }

      const res = await StakeholderService.getByProject(projectId, params);
      if (res?.data?.items) {
        setStakeholders(res.data.items);
      }
    } catch {
      toast.error(STAKEHOLDER_MESSAGES.LOAD_FAILED);
    } finally {
      setStakeholderLoading(false);
    }
  }, [projectId, debouncedSearch]);

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
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error(STAKEHOLDER_MESSAGES.PROJECT_NOT_FOUND);
      }
    };

    fetchProjectId();
  }, []);

  useEffect(() => {
    fetchStakeholders();
  }, [fetchStakeholders]);
  return (
    <>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <SearchBar
          placeholder={STAKEHOLDER_UI.SEARCH_PLACEHOLDER}
          value={search}
          onChange={setSearch}
          showFilter
          showAction
          actionLabel={STAKEHOLDER_UI.ADD_BUTTON}
          onActionClick={() => {
            setStakeholderForm({
              name: '',
              type: 'Real',
              role: '',
              description: '',
              email: '',
              phoneNumber: '',
            });
            setErrors({});
            setOpenStakeholderForm(true);
          }}
        />
      </div>

      <div className='px-4 md:px-6 pb-12 pt-6 lg:pt-8 bg-slate-50/50 min-h-screen'>
        {stakeholderLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-slate-400 border-r-2 border-r-transparent'></div>
          </div>
        ) : stakeholders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm'>
            <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300'>
              <InboxOutlined className='text-4xl' />
            </div>
            <p className='text-lg font-medium text-slate-800'>{STAKEHOLDER_UI.EMPTY_TITLE}</p>
            <p className='mt-1.5 text-sm text-slate-500 max-w-sm'>{STAKEHOLDER_UI.EMPTY_DESC}</p>
          </div>
        ) : (
          <ul className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {stakeholders.map((s) => (
              <li
                key={s.id}
                className='group relative flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-6
  transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-xl hover:shadow-red-900/5'
              >
                <div className='min-w-0 flex-1 mb-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <h3 className='truncate text-lg font-bold text-slate-800 group-hover:text-red-700 transition-colors'>
                        {s.name}
                      </h3>
                      <div className='mt-2 flex flex-wrap items-center gap-2'>
                        <span className='inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100'>
                          {s.role || STAKEHOLDER_UI.NO_ROLE}
                        </span>
                      </div>
                    </div>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-xl font-bold text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors'>
                      <UserOutlined />
                    </div>
                  </div>

                  <div className='mt-6 space-y-3'>
                    {s.description && (
                      <p className='mt-3 text-sm text-slate-500 line-clamp-2'>{s.description}</p>
                    )}
                    <div className='flex items-center gap-3 text-sm text-slate-500'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400'>
                        <MailOutlined />
                      </div>
                      <span className='truncate font-medium text-slate-600'>{s.email}</span>
                    </div>
                    {s.phoneNumber && (
                      <div className='flex items-center gap-3 text-sm text-slate-500'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400'>
                          <PhoneOutlined />
                        </div>
                        <span className='font-medium text-slate-600'>{s.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-auto'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStakeholderId(s.id);
                      setStakeholderForm({
                        name: s.name || '',
                        type: s.type || 'Real',
                        role: s.role || '',
                        description: s.description || '',
                        email: s.email || '',
                        phoneNumber: s.phoneNumber || '',
                      });
                      setErrors({});
                      setOpenStakeholderForm(true);
                    }}
                    className='flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700'
                    title={STAKEHOLDER_UI.EDIT_BUTTON}
                  >
                    <EditOutlined className='text-[16px]' />
                    <span>{STAKEHOLDER_UI.EDIT_BUTTON}</span>
                  </button>

                  <Popconfirm
                    title={STAKEHOLDER_UI.DELETE_TITLE}
                    description={STAKEHOLDER_UI.DELETE_CONFIRM}
                    okText={STAKEHOLDER_UI.DELETE}
                    cancelText={STAKEHOLDER_UI.CANCEL}
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDeleteStakeholder(s.id)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className='flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600'
                      title={STAKEHOLDER_UI.DELETE_BUTTON}
                    >
                      <DeleteOutlined className='text-[16px]' />
                      <span>{STAKEHOLDER_UI.DELETE_BUTTON}</span>
                    </button>
                  </Popconfirm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {openStakeholderForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all'>
          <div className='flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5'>
              <h2 className='text-lg font-semibold text-slate-800'>
                {editingStakeholderId ? STAKEHOLDER_UI.MODAL_EDIT : STAKEHOLDER_UI.MODAL_ADD}
              </h2>
              <button
                onClick={() => {
                  setOpenStakeholderForm(false);
                  setErrors({});
                }}
                className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600'
              >
                <CloseOutlined />
              </button>
            </div>

            <div className='space-y-4 overflow-y-auto px-6 py-5'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {STAKEHOLDER_UI.FIELD_NAME} <span className='text-red-500'>*</span>
                </label>
                <input
                  value={stakeholderForm.name}
                  onChange={(e) => {
                    setStakeholderForm({ ...stakeholderForm, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full rounded-xl border ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-2.5 text-sm outline-none transition-all focus:ring-1`}
                  placeholder={STAKEHOLDER_UI.PLACEHOLDER_NAME}
                />
                {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name}</p>}
              </div>

              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {STAKEHOLDER_UI.FIELD_EMAIL} <span className='text-red-500'>*</span>
                </label>
                <input
                  disabled={!!editingStakeholderId}
                  type='email'
                  value={stakeholderForm.email}
                  onChange={(e) => {
                    setStakeholderForm({ ...stakeholderForm, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full rounded-xl border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-2.5 text-sm outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 focus:ring-1`}
                  placeholder={STAKEHOLDER_UI.PLACEHOLDER_EMAIL}
                />
                {errors.email && <p className='mt-1 text-xs text-red-500'>{errors.email}</p>}
              </div>

              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {STAKEHOLDER_UI.FIELD_ROLE}
                </label>
                <select
                  value={stakeholderForm.role}
                  onChange={(e) => {
                    setStakeholderForm({ ...stakeholderForm, role: e.target.value });
                    if (errors.role) setErrors({ ...errors, role: null });
                  }}
                  className={`w-full rounded-xl border ${errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-2.5 text-sm outline-none transition-all focus:ring-1 bg-white`}
                >
                  <option value='' disabled>
                    {STAKEHOLDER_UI.ROLE_SELECT}
                  </option>
                  <option value='Mentor'>{STAKEHOLDER_UI.ROLE_MENTOR}</option>
                  <option value='Supervisor'>{STAKEHOLDER_UI.ROLE_SUPERVISOR}</option>
                  <option value='Lecturer'>{STAKEHOLDER_UI.ROLE_LECTURER}</option>
                  <option value='Team Member'>{STAKEHOLDER_UI.ROLE_MEMBER}</option>
                </select>
                {errors.role && <p className='mt-1 text-xs text-red-500'>{errors.role}</p>}
              </div>

              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {STAKEHOLDER_UI.FIELD_PHONE}
                </label>
                <input
                  value={stakeholderForm.phoneNumber}
                  onChange={(e) => {
                    setStakeholderForm({ ...stakeholderForm, phoneNumber: e.target.value });
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                  }}
                  className={`w-full rounded-xl border ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-2.5 text-sm outline-none transition-all focus:ring-1`}
                  placeholder={STAKEHOLDER_UI.PLACEHOLDER_PHONE}
                />
                {errors.phoneNumber && (
                  <p className='mt-1 text-xs text-red-500'>{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {STAKEHOLDER_UI.FIELD_DESC}
                </label>
                <textarea
                  rows={3}
                  value={stakeholderForm.description}
                  onChange={(e) => {
                    setStakeholderForm({ ...stakeholderForm, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: null });
                  }}
                  className={`w-full resize-none rounded-xl border ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-2.5 text-sm outline-none transition-all focus:ring-1`}
                  placeholder={STAKEHOLDER_UI.PLACEHOLDER_DESC}
                />
                {errors.description && (
                  <p className='mt-1 text-xs text-red-500'>{errors.description}</p>
                )}
              </div>
            </div>

            <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4'>
              <button
                onClick={() => {
                  setOpenStakeholderForm(false);
                  setErrors({});
                }}
                className='rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 transition-colors hover:bg-slate-50'
              >
                {STAKEHOLDER_UI.CANCEL}
              </button>
              <button
                onClick={handleSaveStakeholder}
                className='rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm'
              >
                {editingStakeholderId ? STAKEHOLDER_UI.UPDATE : STAKEHOLDER_UI.SAVE}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
