'use client';

import React, { memo } from 'react';
import { Modal, Divider, Typography, Row, Col, Avatar, Button } from 'antd';
import {
  InfoCircleOutlined,
  FileTextOutlined,
  SolutionOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
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
      width={560}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <InfoCircleOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {DETAIL.TITLE}
          </Title>
          <Text className='text-muted text-xs italic'>
            Thông tin chi tiết về vấn đề đã được ghi nhận
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <div className='mt-8 space-y-8 px-2'>
        {/* Basic Info */}
        <div className='space-y-6'>
          {/* Title Section */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <FileTextOutlined className='text-primary' />
              <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                {TABLE.TITLE}
              </Text>
            </div>
            <Title level={5} className='text-text !m-0 leading-tight'>
              {issue.title}
            </Title>
          </div>

          {/* Stakeholder & Status */}
          <Row gutter={24}>
            <Col span={12}>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <UserOutlined className='text-primary' />
                  <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                    {TABLE.STAKEHOLDER}
                  </Text>
                </div>
                <div className='flex items-center gap-2'>
                  <Avatar
                    size='small'
                    icon={<UserOutlined />}
                    className='bg-primary/10 text-primary border-none'
                  />
                  <Text className='text-text text-sm font-bold'>
                    {issue.stakeholderName || '—'}
                  </Text>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <InfoCircleOutlined className='text-primary' />
                  <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                    {TABLE.STATUS}
                  </Text>
                </div>
                <IssueStatusTag status={issue.status} />
              </div>
            </Col>
          </Row>

          {/* Timeline */}
          <div className='bg-muted/5 border-border rounded-2xl border p-4'>
            <Row gutter={24}>
              <Col span={12}>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <ClockCircleOutlined className='text-muted text-xs' />
                    <Text className='text-muted text-[10px] font-bold uppercase'>
                      {DETAIL.CREATED_AT}
                    </Text>
                  </div>
                  <Text className='text-text text-sm font-bold'>
                    {dayjs(issue.createdAt).format('DD/MM/YYYY')}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className='border-border flex flex-col gap-1 border-l pl-6'>
                  <div className='flex items-center gap-2'>
                    <CheckCircleOutlined className='text-muted text-xs' />
                    <Text className='text-muted text-[10px] font-bold uppercase'>
                      {DETAIL.RESOLVED_AT}
                    </Text>
                  </div>
                  <Text className='text-text text-sm font-bold'>
                    {issue.resolvedAt ? dayjs(issue.resolvedAt).format('DD/MM/YYYY') : '—'}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <SolutionOutlined className='text-primary' />
              <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                {TABLE.DESCRIPTION}
              </Text>
            </div>
            <div className='bg-muted/5 border-border relative rounded-xl border p-4'>
              <Paragraph className='text-text mb-0 text-sm leading-relaxed'>
                {issue.description || 'Không có mô tả chi tiết.'}
              </Paragraph>
            </div>
          </div>
        </div>

        <div className='flex justify-end pt-2 pb-2'>
          <Button
            onClick={onClose}
            className='border-border h-11 rounded-xl px-10 font-bold shadow-sm transition-all hover:bg-slate-50'
          >
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default IssueDetailModal;
