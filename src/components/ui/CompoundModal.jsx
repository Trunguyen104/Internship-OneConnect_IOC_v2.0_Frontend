'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import PropTypes from 'prop-types';
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

CompoundModal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  destroyOnClose: PropTypes.bool,
};

const Header = ({ icon, title, subtitle, type = 'default' }) => {
  const typeClasses = {
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
    default: 'bg-primary/10 text-primary',
  };

  return (
    <div className="flex flex-col items-center gap-3 border-b border-gray-50 pb-5 text-center">
      {icon && (
        <div
          className={`flex size-12 items-center justify-center rounded-2xl text-xl shadow-sm transition-all duration-300 ${typeClasses[type] || typeClasses.default}`}
        >
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <Title level={4} className="!m-0 text-lg font-black tracking-tight text-slate-800">
          {title}
        </Title>
        {subtitle && (
          <p className="text-xs font-medium leading-relaxed text-slate-400">{subtitle}</p>
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
    <div className={`mt-6 flex justify-end gap-3 border-t border-gray-50 pt-5 ${className}`}>
      {showCancel && (
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="ghost"
          className="h-11 rounded-full px-6 text-[13px] font-bold text-muted/60 transition-all hover:bg-gray-50 hover:text-text"
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
        className={`h-11 min-w-[120px] rounded-full px-6 text-[12px] font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95 ${
          !finalDanger
            ? 'bg-primary shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30'
            : 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600 hover:shadow-rose-500/30'
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

const InfoBox = ({ label, value, color = 'primary' }) => (
  <div
    className={`bg-gray-50/50 border-gray-100 rounded-2xl border p-4 transition-all duration-300 ${COLOR_MAP[color] || COLOR_MAP.primary}`}
  >
    <Text
      type="secondary"
      className="text-muted/60 mb-1.5 block text-[10px] font-black uppercase tracking-widest"
    >
      {label}
    </Text>
    <Text strong className="text-slate-800 block text-sm font-bold">
      {value}
    </Text>
  </div>
);

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
