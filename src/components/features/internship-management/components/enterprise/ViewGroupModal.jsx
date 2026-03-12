'use client';

import React from 'react';
import { Modal, Button, Avatar } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { MOCK_MENTORS } from '../../hooks/useGroupManagement';

// const { Text } = Typography;

export function ViewGroupModal({ open, group, onCancel }) {
  const mentor = MOCK_MENTORS.find((m) => m.id === group?.mentorId);

  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={false}
      onCancel={onCancel}
      width={640}
      centered
      className='view-modal'
    >
      <div className='flex items-start justify-between border-b border-slate-100 bg-slate-50/50 p-5'>
        <div>
          <h2 className='mb-1 text-xl leading-none font-bold text-slate-900'>{group?.name}</h2>
          <p className='font-medium tracking-wide text-[xs] text-slate-400 uppercase'>
            {group?.track} • {group?.status}
          </p>
        </div>
        <button onClick={onCancel} className='text-slate-400 transition-colors hover:text-rose-500'>
          <CloseOutlined className='text-lg' />
        </button>
      </div>

      <div className='p-5 pt-4'>
        <div className='mb-5 grid grid-cols-2 gap-4'>
          <div className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
            <p className='mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
              Mentor
            </p>
            <p className='truncate font-bold text-slate-700'>{mentor?.name || 'Not Assigned'}</p>
          </div>
          <div className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
            <p className='mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
              Current Members
            </p>
            <p className='font-bold text-slate-700'>{group?.memberCount} students</p>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className='pl-1 text-[11px] font-black tracking-widest text-slate-400 uppercase'>
            Student List
          </h3>
          <div className='custom-scrollbar max-h-[320px] space-y-1.5 overflow-y-auto pr-2'>
            {group?.avatars?.length > 0 ? (
              Array.from({ length: group.memberCount }).map((_, i) => (
                <div
                  key={i}
                  className='group flex items-center justify-between rounded-xl border border-transparent p-2.5 transition-all hover:border-slate-100 hover:bg-slate-50'
                >
                  <div className='flex items-center gap-3 overflow-hidden'>
                    <Avatar
                      src={group.avatars[i % group.avatars.length]}
                      size='large'
                      className='flex-shrink-0 border-2 border-white shadow-sm'
                    />
                    <div className='min-w-0'>
                      <p className='mb-1 truncate text-sm leading-none font-bold text-slate-900'>
                        Student Name {i + 1}
                      </p>
                      <p className='text-[10px] font-medium text-slate-400'>Software Engineering</p>
                    </div>
                  </div>
                  <Button
                    type='text'
                    size='small'
                    className='text-[10px] font-bold text-blue-600 opacity-0 transition-all group-hover:opacity-100'
                  >
                    View Bio
                  </Button>
                </div>
              ))
            ) : (
              <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center'>
                <span className='material-symbols-outlined mb-1 text-3xl text-slate-300'>
                  group_off
                </span>
                <p className='text-xs font-medium text-slate-400'>No students assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 p-4'>
        <Button
          className='h-10 rounded-full border-slate-200 px-6 font-bold text-slate-600 hover:bg-white'
          onClick={onCancel}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}
