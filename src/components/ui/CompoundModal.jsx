'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { cn } from '@/lib/cn';

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

CompoundModal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  destroyOnClose: PropTypes.bool,
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

Header.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  type: PropTypes.oneOf(['default', 'danger', 'warning', 'success']),
};

const Content = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>{children}</div>
);

Content.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

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

Footer.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  onSubmit: PropTypes.func,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  submitText: PropTypes.string,
  loading: PropTypes.bool,
  danger: PropTypes.bool,
  submitDanger: PropTypes.bool,
  confirmIcon: PropTypes.node,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  showCancel: PropTypes.bool,
  className: PropTypes.string,
};

const COLOR_MAP = {
  primary: {
    bg: 'bg-primary-surface',
    border: 'border-primary-100',
    dot: 'bg-primary',
    text: 'text-primary-600',
  },
  danger: {
    bg: 'bg-danger-surface',
    border: 'border-danger-100',
    dot: 'bg-danger',
    text: 'text-danger-600',
  },
  success: {
    bg: 'bg-success-surface',
    border: 'border-success-100',
    dot: 'bg-success',
    text: 'text-success-600',
  },
  warning: {
    bg: 'bg-warning-surface',
    border: 'border-warning-border',
    dot: 'bg-warning',
    text: 'text-warning-text',
  },
};

const InfoBox = ({ label, value, color = 'primary' }) => {
  const current = COLOR_MAP[color] || COLOR_MAP.primary;
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
        current.bg,
        current.border
      )}
    >
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-1.5">
          <div className={cn('h-1 w-1 rounded-full', current.dot)} />
          <Text
            type="secondary"
            className="text-muted block text-[9px] font-black uppercase tracking-wider opacity-60"
          >
            {label}
          </Text>
        </div>
        <Text
          strong
          className={cn('block text-sm font-black leading-tight tracking-tight', current.text)}
        >
          {value}
        </Text>
      </div>
    </div>
  );
};

InfoBox.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'danger', 'success', 'warning']),
};

CompoundModal.Header = Header;
CompoundModal.Content = Content;
CompoundModal.Body = Content; // Alias for Content
CompoundModal.Footer = Footer;
CompoundModal.InfoBox = InfoBox;

export default CompoundModal;
