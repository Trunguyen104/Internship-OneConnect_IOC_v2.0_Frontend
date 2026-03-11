'use client';

import { InboxOutlined } from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import StakeholderCard from './StakeholderCard';

export default function StakeholderList({ stakeholders, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-slate-400 border-r-transparent'></div>
      </div>
    );
  }

  if (stakeholders.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white py-20 text-center shadow-sm'>
        <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300'>
          <InboxOutlined className='text-4xl' />
        </div>
        <p className='text-lg font-medium text-slate-800'>{STAKEHOLDER_UI.EMPTY_TITLE}</p>
        <p className='mt-1.5 max-w-sm text-sm text-slate-500'>{STAKEHOLDER_UI.EMPTY_DESC}</p>
      </div>
    );
  }

  return (
    <ul className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      {stakeholders.map((s) => (
        <StakeholderCard key={s.id} stakeholder={s} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
