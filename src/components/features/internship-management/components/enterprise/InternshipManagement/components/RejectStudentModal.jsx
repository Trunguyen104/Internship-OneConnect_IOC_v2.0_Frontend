'use client';

import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';

const RejectStudentModal = ({ open, student, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('');

  // useEffect(() => {
  //   if (!open && reason) {
  //     setReason('');
  //   }
  // }, [open, reason]);
  const handleCancel = () => {
    setReason('');
    onCancel();
  };
  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={false}
      onCancel={handleCancel}
      width={520}
      className='reject-modal'
    >
      <div className='border-primary/10 relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-2xl'>
        <div className='flex flex-col items-center justify-center px-6 pt-8 pb-4 text-center'>
          <ExclamationCircleOutlined className='text-4xl' />
          <h3 className='text-xl font-bold text-slate-900'>Reject Student Application</h3>
        </div>

        <div className='px-8 py-2'>
          <div className='bg-primary/5 border-primary mb-6 rounded-r-lg border-l-4 p-4'>
            <p className='text-sm leading-relaxed text-slate-700'>
              You are about to reject student{' '}
              <span className='font-bold text-slate-900'>{student?.fullName}</span>. This action
              cannot be undone and the student will be notified immediately.
            </p>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-semibold text-slate-700'>
              Reason for Rejection <span className='text-primary'>*</span>
            </label>
            <Input.TextArea
              className='focus:ring-primary min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-transparent focus:ring-2'
              placeholder='Please provide a detailed reason for the rejection (e.g., missing qualifications, poor interview performance)...'
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className='mt-8 flex flex-col gap-3 px-8 pb-8 sm:flex-row'>
          <Button
            className='order-2 h-12 flex-1 rounded-full border-2 border-slate-200 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 sm:order-1'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className='bg-primary shadow-primary/20 order-1 flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-none text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700 sm:order-2'
            disabled={!reason.trim()}
            onClick={() => student && onConfirm(student.id, reason)}
          >
            <span className='truncate'>Confirm Reject</span>
          </Button>
        </div>

        <div className='absolute top-4 right-4'>
          <button
            className='text-slate-400 transition-colors hover:text-slate-600'
            onClick={onCancel}
          >
            <TeamOutlined />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectStudentModal;
