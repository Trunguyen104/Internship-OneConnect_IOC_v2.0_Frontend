'use client';

import {
  InboxOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

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
        <li
          key={s.id}
          className='group hover:border-primary/20 hover:shadow-primary/5 relative flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl'
        >
          <div className='mb-6 min-w-0 flex-1'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <h3 className='group-hover:text-primary truncate text-lg font-bold text-slate-800 transition-colors'>
                  {s.name}
                </h3>
                <div className='mt-2 flex flex-wrap items-center gap-2'>
                  <span className='bg-primary/5 text-primary border-primary/10 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold'>
                    {s.role || STAKEHOLDER_UI.NO_ROLE}
                  </span>
                </div>
              </div>
              <div className='group-hover:bg-primary/5 group-hover:text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-xl font-bold text-slate-400 transition-colors'>
                <UserOutlined />
              </div>
            </div>

            <div className='mt-6 space-y-3'>
              {s.description && (
                <p className='mt-3 line-clamp-2 text-sm text-slate-500'>{s.description}</p>
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

          <div className='mt-auto flex items-center justify-end gap-2 border-t border-slate-100 pt-4'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(s);
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
              onConfirm={() => onDelete(s.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className='hover:bg-primary/5 hover:text-primary flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors'
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
  );
}
