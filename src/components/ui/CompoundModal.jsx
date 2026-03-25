'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

const CompoundModal = ({
  children,
  open,
  onCancel,
  width = 440,
  destroyOnClose = true,
  ...props
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={width}
      destroyOnHidden={destroyOnClose}
      footer={null}
      closeIcon={
        <div className="mt-1">
          <CloseOutlined className="text-muted hover:text-text transition-colors" />
        </div>
      }
      className="premium-modal"
      {...props}
    >
      <div className="flex flex-col">{children}</div>
    </Modal>
  );
};

const Header = ({ icon, title, subtitle, type = 'default' }) => {
  const typeClasses = {
    danger: 'bg-danger/5 text-danger',
    warning: 'bg-warning/5 text-warning',
    success: 'bg-success/5 text-success',
    default: 'bg-primary/5 text-primary',
  };

  return (
    <div className="border-border flex flex-col items-center gap-2.5 border-b pt-0.5 pb-3 text-center">
      {icon && (
        <div
          className={`flex size-10 items-center justify-center rounded-xl text-lg shadow-sm ${typeClasses[type] || typeClasses.default}`}
        >
          {icon}
        </div>
      )}
      <div className="space-y-0.5">
        <Title level={4} className="text-text !m-0 text-base font-black tracking-tight">
          {title}
        </Title>
        {subtitle && (
          <div className="text-muted text-[11px] leading-relaxed font-medium opacity-60">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

const Content = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>{children}</div>
);

const Footer = ({
  onCancel,
  onConfirm,
  onSubmit,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  submitText,
  loading = false,
  danger = false,
  submitDanger,
  confirmIcon,
  icon,
  disabled = false,
  submitDisabled,
  showCancel = true,
  className = '',
}) => {
  const finalOnConfirm = onConfirm || onSubmit;
  const finalConfirmText = confirmText || submitText;
  const finalDanger = danger || submitDanger;
  const finalIcon = confirmIcon || icon;
  const finalDisabled = disabled || submitDisabled;

  return (
    <div className={`border-border mt-1.5 flex justify-end gap-2 border-t pt-3.5 ${className}`}>
      {showCancel && (
        <Button
          onClick={onCancel}
          disabled={loading}
          className="border-border text-muted hover:bg-surface hover:text-text h-9 rounded-xl px-4 text-[11px] font-bold transition-all"
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="primary"
        danger={finalDanger}
        loading={loading}
        onClick={finalOnConfirm}
        icon={finalIcon}
        disabled={finalDisabled}
        className={`h-9 min-w-[90px] rounded-xl px-4 text-[11px] font-bold shadow-sm transition-all focus:shadow-none focus-visible:outline-none ${
          !finalDanger ? 'bg-primary hover:bg-primary-hover border-none' : ''
        }`}
      >
        {finalConfirmText}
      </Button>
    </div>
  );
};

const COLOR_MAP = {
  primary: 'hover:border-primary/50',
  danger: 'hover:border-danger/50',
  success: 'hover:border-success/50',
  warning: 'hover:border-warning/50',
};

const InfoBox = ({ label, value, color = 'primary' }) => (
  <div
    className={`bg-slate-50/50 border-gray-100 rounded-xl border p-2.5 transition-colors ${COLOR_MAP[color] || COLOR_MAP.primary}`}
  >
    <Text
      type="secondary"
      className="text-muted mb-0.5 block text-[9px] font-bold tracking-wide opacity-70"
    >
      {label}
    </Text>
    <Text strong className="text-text text-[13px] leading-tight block">
      {value}
    </Text>
  </div>
);

CompoundModal.Header = Header;
CompoundModal.Content = Content;
CompoundModal.Body = Content; // Alias for Content
CompoundModal.Footer = Footer;
CompoundModal.InfoBox = InfoBox;

export default CompoundModal;
