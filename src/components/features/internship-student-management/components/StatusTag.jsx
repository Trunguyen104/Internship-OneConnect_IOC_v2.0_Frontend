import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

const StatusTag = ({ status }) => {
  const configs = {
    ACCEPTED: {
      color: 'success',
      icon: <CheckCircleOutlined />,
      bgClass: '!bg-success-surface',
      textClass: '!text-success',
    },
    PENDING: {
      color: 'processing',
      icon: <InfoCircleOutlined />,
      bgClass: '!bg-info-surface',
      textClass: '!text-info',
    },
    REJECTED: {
      color: 'error',
      icon: <CloseCircleOutlined />,
      bgClass: '!bg-danger-surface',
      textClass: '!text-danger',
    },
    REVOKED: {
      color: 'default',
      icon: <ExclamationCircleOutlined />,
      bgClass: '!bg-gray-100',
      textClass: '!text-gray-500',
    },
  };
  const config = configs[status] || configs.PENDING;

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase"
    >
      {status}
    </Tag>
  );
};

export default StatusTag;
