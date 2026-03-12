'use client';
import React from 'react';
import { Modal, Button } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const TermDeleteModal = ({ open, onCancel, onConfirm, record }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered
      width={440}
      styles={{ content: { padding: 0, borderRadius: '0.75rem', overflow: 'hidden' } }}
    >
      <div className='flex flex-col items-center bg-white p-8 text-center'>
        <div className='bg-danger/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
          <WarningOutlined className='text-danger text-[28px]' />
        </div>
        <h3 className='mb-2 text-[20px] font-bold text-slate-900'>Xóa Kỳ thực tập?</h3>
        <p className='mb-8 text-sm leading-relaxed text-slate-500'>
          Bạn có chắc chắn muốn xóa{' '}
          <span className='font-semibold text-slate-700'>&quot;{record?.name}&quot;</span>? Hành
          động này không thể hoàn tác.
        </p>
        <div className='flex w-full items-center gap-3'>
          <Button
            onClick={onCancel}
            className='h-11 flex-1 rounded-full border border-slate-200 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50'
            type='default'
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={onConfirm}
            className='bg-primary hover:bg-primary-hover shadow-primary/20 h-11 flex-1 rounded-full border-none text-sm font-bold text-white shadow-lg transition-colors'
            type='primary'
          >
            Xóa kỳ thực tập
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TermDeleteModal;
