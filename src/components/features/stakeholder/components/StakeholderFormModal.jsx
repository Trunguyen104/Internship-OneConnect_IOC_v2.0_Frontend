'use client';

import { CloseOutlined } from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import FormGroup from './FormGroup';

export default function StakeholderFormModal({
  isOpen,
  onClose,
  editingId,
  form,
  setForm,
  errors,
  setErrors,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all'>
      <div className='flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5'>
          <h2 className='text-lg font-semibold text-slate-800'>
            {editingId ? STAKEHOLDER_UI.MODAL_EDIT : STAKEHOLDER_UI.MODAL_ADD}
          </h2>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600'
          >
            <CloseOutlined />
          </button>
        </div>

        <div className='space-y-4 overflow-y-auto px-6 py-5'>
          <FormGroup label={STAKEHOLDER_UI.FIELD_NAME} required error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full rounded-xl border ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary focus:ring-primary/20 border-slate-200'} px-4 py-2.5 text-sm transition-all outline-none focus:ring-1`}
              placeholder={STAKEHOLDER_UI.PLACEHOLDER_NAME}
            />
          </FormGroup>

          <FormGroup label={STAKEHOLDER_UI.FIELD_EMAIL} required error={errors.email}>
            <input
              disabled={!!editingId}
              type='email'
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={`w-full rounded-xl border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary focus:ring-primary/20 border-slate-200'} px-4 py-2.5 text-sm transition-all outline-none focus:ring-1 disabled:bg-slate-50 disabled:text-slate-500`}
              placeholder={STAKEHOLDER_UI.PLACEHOLDER_EMAIL}
            />
          </FormGroup>

          <FormGroup label={STAKEHOLDER_UI.FIELD_ROLE} error={errors.role}>
            <select
              value={form.role}
              onChange={(e) => {
                setForm({ ...form, role: e.target.value });
                if (errors.role) setErrors({ ...errors, role: null });
              }}
              className={`w-full rounded-xl border ${errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary focus:ring-primary/20 border-slate-200'} bg-white px-4 py-2.5 text-sm transition-all outline-none focus:ring-1`}
            >
              <option value='' disabled>
                {STAKEHOLDER_UI.ROLE_SELECT}
              </option>
              <option value='Mentor'>{STAKEHOLDER_UI.ROLE_MENTOR}</option>
              <option value='Supervisor'>{STAKEHOLDER_UI.ROLE_SUPERVISOR}</option>
              <option value='Lecturer'>{STAKEHOLDER_UI.ROLE_LECTURER}</option>
              <option value='Team Member'>{STAKEHOLDER_UI.ROLE_MEMBER}</option>
            </select>
          </FormGroup>

          <FormGroup label={STAKEHOLDER_UI.FIELD_PHONE} error={errors.phoneNumber}>
            <input
              type='tel'
              value={form.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9+\-().\s]/g, '');
                setForm({ ...form, phoneNumber: value });
                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
              }}
              className={`w-full rounded-xl border ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary focus:ring-primary/20 border-slate-200'} px-4 py-2.5 text-sm transition-all outline-none focus:ring-1`}
              placeholder={STAKEHOLDER_UI.PLACEHOLDER_PHONE}
            />
          </FormGroup>

          <FormGroup label={STAKEHOLDER_UI.FIELD_DESC} error={errors.description}>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              className={`w-full resize-none rounded-xl border ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary focus:ring-primary/20 border-slate-200'} px-4 py-2.5 text-sm transition-all outline-none focus:ring-1`}
              placeholder={STAKEHOLDER_UI.PLACEHOLDER_DESC}
            />
          </FormGroup>
        </div>

        <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4'>
          <button
            onClick={onClose}
            className='rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50'
          >
            {STAKEHOLDER_UI.CANCEL}
          </button>
          <button
            onClick={onSave}
            className='bg-primary hover:bg-primary-hover rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors'
          >
            {editingId ? STAKEHOLDER_UI.UPDATE : STAKEHOLDER_UI.SAVE}
          </button>
        </div>
      </div>
    </div>
  );
}
