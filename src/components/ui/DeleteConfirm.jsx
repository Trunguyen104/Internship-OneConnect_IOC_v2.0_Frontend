import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { modalApi } from '@/providers/ToastProvider';

export const showDeleteConfirm = ({
  title = 'Confirm Delete',
  content = 'Are you sure you want to delete this item? This action cannot be undone.',
  onOk,
  okText = 'Delete',
  cancelText = 'Cancel',
  type = 'delete',
}) => {
  const isDelete = type === 'delete';
  const Icon = isDelete ? Trash2 : AlertCircle;
  const iconColorClass = isDelete ? 'text-red-600' : 'text-amber-600';
  const iconBgClass = isDelete ? 'bg-red-50' : 'bg-amber-50';
  const okBtnClass = isDelete
    ? 'bg-red-600 hover:bg-red-700 border-none'
    : 'bg-amber-600 hover:bg-amber-700 border-none';

  const confirm = modalApi ? modalApi.confirm : require('antd').Modal.confirm;

  return confirm({
    icon: null,
    title: (
      <div className='flex items-center gap-3'>
        <div className={`p-2 ${iconBgClass} rounded-xl`}>
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        </div>
        <span className='text-lg font-bold text-slate-800'>{title}</span>
      </div>
    ),
    content: <div className='mt-2 leading-relaxed text-slate-600'>{content}</div>,
    okText,
    okType: isDelete ? 'danger' : 'primary',
    cancelText,
    centered: true,
    width: 440,
    className: 'premium-confirm-modal',
    okButtonProps: {
      className: `${okBtnClass} rounded-xl h-10 px-6 font-medium transition-all shadow-sm`,
    },
    cancelButtonProps: {
      className:
        'rounded-xl h-10 px-6 font-medium border-slate-200 text-slate-600 hover:text-slate-800 transition-all',
    },
    onOk,
  });
};
