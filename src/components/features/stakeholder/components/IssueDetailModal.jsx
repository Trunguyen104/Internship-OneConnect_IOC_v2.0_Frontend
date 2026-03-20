'use client';

import { Button, Col, Divider, Modal, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

import IssueStatusTag from './IssueStatusTag';

const { Title, Text, Paragraph } = Typography;

const IssueDetailModal = memo(function IssueDetailModal({ issue, onClose }) {
  if (!issue) return null;

  const { DETAIL, TABLE } = ISSUE_UI;

  return (
    <Modal
      open={!!issue}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      title={DETAIL.TITLE}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">{TABLE.TITLE}</Text>
        <Title level={5}>{issue.title}</Title>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Text type="secondary">{TABLE.STAKEHOLDER}</Text>
          <div style={{ marginTop: 4 }}>
            <Text strong>{issue.stakeholderName || '—'}</Text>
          </div>
        </Col>

        <Col span={12}>
          <Text type="secondary">{TABLE.STATUS}</Text>
          <div style={{ marginTop: 4 }}>
            <IssueStatusTag status={issue.status} />
          </div>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Text type="secondary">{DETAIL.CREATED_AT}</Text>
          <div>
            <Text strong>{dayjs(issue.createdAt).format('DD/MM/YYYY')}</Text>
          </div>
        </Col>

        <Col span={12}>
          <Text type="secondary">{DETAIL.RESOLVED_AT}</Text>
          <div>
            <Text strong>
              {issue.resolvedAt ? dayjs(issue.resolvedAt).format('DD/MM/YYYY') : '—'}
            </Text>
          </div>
        </Col>
      </Row>

      <div style={{ marginBottom: 20 }}>
        <Text type="secondary">{TABLE.DESCRIPTION}</Text>
        <Paragraph style={{ marginTop: 4 }}>
          {issue.description || 'No detailed description.'}
        </Paragraph>
      </div>

      <div style={{ textAlign: 'right' }}>
        <Button onClick={onClose}>{ISSUE_UI.BUTTON.CLOSE}</Button>
      </div>
    </Modal>
  );
});

export default IssueDetailModal;
