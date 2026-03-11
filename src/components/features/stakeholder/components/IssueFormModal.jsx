'use client';

import { CloseOutlined } from '@ant-design/icons';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import FormGroup from './FormGroup';

export default function IssueFormModal({ isOpen, onClose, form, setForm, stakeholders, onSave }) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5'>
          <h2 className='text-lg font-semibold text-slate-800'>{ISSUE_UI.FORM.ADD_TITLE}</h2>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600'
          >
            <CloseOutlined />
          </button>
        </div>

        <div className='space-y-4 overflow-y-auto px-6 py-5'>
          <FormGroup label={ISSUE_UI.TABLE.TITLE} required>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className='focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all outline-none focus:ring-1'
              placeholder={ISSUE_UI.FORM.TITLE_PLACEHOLDER}
            />
          </FormGroup>

          <FormGroup label={ISSUE_UI.TABLE.STAKEHOLDER} required>
            <select
              value={form.stakeholderId}
              onChange={(e) => setForm({ ...form, stakeholderId: e.target.value })}
              className='focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all outline-none focus:ring-1'
            >
              <option value=''>{ISSUE_UI.FORM.STAKEHOLDER_PLACEHOLDER}</option>
              {stakeholders.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label={ISSUE_UI.TABLE.DESCRIPTION}>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className='focus:border-primary focus:ring-primary/20 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all outline-none focus:ring-1'
              placeholder={ISSUE_UI.FORM.DESCRIPTION_PLACEHOLDER}
            />
          </FormGroup>
        </div>

        <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4'>
          <button
            onClick={onClose}
            className='rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50'
          >
            {ISSUE_UI.BUTTON.CANCEL}
          </button>
          <button
            onClick={onSave}
            className='bg-primary hover:bg-primary-hover rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors'
          >
            {ISSUE_UI.BUTTON.SAVE}
          </button>
        </div>
      </div>
    </div>
  );
}
