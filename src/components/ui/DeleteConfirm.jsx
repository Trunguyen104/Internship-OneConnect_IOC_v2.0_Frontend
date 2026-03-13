import React from 'react';
import { Modal } from 'antd';
import { Trash2, AlertCircle } from 'lucide-react';

/**
 * Standardized delete confirmation modal with a premium look and feel.
 * Located in UI components for better architectural consistency.
 *
 * @param {Object} options
 * @param {string} options.title - The title of the modal (default: 'Confirm Delete')
 * @param {React.ReactNode} options.content - The content/message of the modal
 * @param {Function} options.onOk - Callback when user confirms the delete
 * @param {string} options.okText - Text for the confirm button (default: 'Delete')
 * @param {string} options.cancelText - Text for the cancel button (default: 'Cancel')
 * @param {string} options.type - 'delete' (default) or 'warning'
 */
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

  return Modal.confirm({
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
