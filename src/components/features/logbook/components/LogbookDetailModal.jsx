'use client';

import { Divider, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

import LogbookStatusTag from './LogbookStatusTag';

const { Text, Paragraph } = Typography;

const LogbookDetailModal = memo(function LogbookDetailModal({ visible, record, onClose }) {
  const { VIEW_MODAL, FORM, TABLE } = DAILY_REPORT_UI;

  if (!record) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      title={VIEW_MODAL.TITLE}
    >
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <div>
          <Text type="secondary">{FORM.REPORT_DATE}</Text>
          <br />
          <Text strong>{dayjs(record.dateReport).format(DAILY_REPORT_UI.DATE_FORMAT)}</Text>
        </div>

        <div>
          <Text type="secondary">{TABLE.STUDENT}</Text>
          <br />
          <Text strong>{record.studentName}</Text>
        </div>

        <div>
          <Text type="secondary">{TABLE.STATUS}</Text>
          <br />
          <LogbookStatusTag status={record.status} />
        </div>

        <Divider />

        <div>
          <Text strong>{FORM.SUMMARY}</Text>
          <Paragraph style={{ marginBottom: 0 }}>{record.summary || '-'}</Paragraph>
        </div>

        <div>
          <Text strong>{FORM.ISSUE}</Text>
          <Paragraph style={{ marginBottom: 0 }}>{record.issue || '-'}</Paragraph>
        </div>

        <div>
          <Text strong>{FORM.PLAN}</Text>
          <Paragraph style={{ marginBottom: 0 }}>{record.plan || '-'}</Paragraph>
        </div>
      </Space>
    </Modal>
  );
});

export default LogbookDetailModal;
