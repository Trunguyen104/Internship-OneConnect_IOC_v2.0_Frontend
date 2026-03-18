'use client';

import { Modal as AntModal, Button } from 'antd';
import { cn } from '@/lib/cn';

function ModalRoot({ open, onCancel, children, className = '', bodyClassName = '', ...props }) {
  return (
    <AntModal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      className={className}
      {...props}
    >
      <div data-slot='modal-body' className={cn('space-y-4', bodyClassName)}>
        {children}
      </div>
    </AntModal>
  );
}

function ModalHeader({ children, className = '', ...props }) {
  return (
    <div data-slot='modal-header' className={cn('space-y-1', className)} {...props}>
      {children}
    </div>
  );
}

function ModalTitle({ children, className = '', ...props }) {
  return (
    <div data-slot='modal-title' className={cn('text-lg font-semibold text-slate-900', className)} {...props}>
      {children}
    </div>
  );
}

function ModalDescription({ children, className = '', ...props }) {
  return (
    <div data-slot='modal-description' className={cn('text-sm text-slate-500', className)} {...props}>
      {children}
    </div>
  );
}

function ModalContent({ children, className = '', ...props }) {
  return (
    <div data-slot='modal-content' className={cn('space-y-3', className)} {...props}>
      {children}
    </div>
  );
}

function ModalFooter({ children, className = '', ...props }) {
  return (
    <div
      data-slot='modal-footer'
      className={cn('mt-2 flex items-center justify-end gap-2 border-t border-slate-200 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalActions({
  onCancel,
  onOk,
  okText = 'OK',
  cancelText = 'Cancel',
  confirmLoading = false,
  okButtonProps,
  cancelButtonProps,
}) {
  return (
    <>
      <Button onClick={onCancel} {...cancelButtonProps}>
        {cancelText}
      </Button>
      <Button type='primary' loading={confirmLoading} onClick={onOk} {...okButtonProps}>
        {okText}
      </Button>
    </>
  );
}

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Content: ModalContent,
  Footer: ModalFooter,
  Actions: ModalActions,
});

export default Modal;
export { Modal, ModalRoot, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter, ModalActions };

