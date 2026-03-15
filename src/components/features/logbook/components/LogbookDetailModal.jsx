'use client';

import React, { memo } from 'react';
import { Modal, Typography, Divider, Avatar } from 'antd';
import {
  FileSearchOutlined,
  SolutionOutlined,
  InfoCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import LogbookStatusTag from './LogbookStatusTag';

const { Title, Text, Paragraph } = Typography;

const LogbookDetailModal = memo(function LogbookDetailModal({ visible, record, onClose }) {
  const { VIEW_MODAL, TABLE, FORM } = DAILY_REPORT_UI;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <FileSearchOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {VIEW_MODAL.TITLE}
          </Title>
          <Text className='text-muted text-xs italic'>
            {record ? dayjs(record.dateReport).format('DD/MM/YYYY') : ''}
          </Text>
        </div>
      </div>

      {record && (
        <div className='space-y-8 px-2 pb-4'>
          <Divider className='border-border m-0' />

          <div className='bg-muted/5 border-border flex items-center justify-between gap-4 rounded-2xl border p-5'>
            <div className='flex items-center gap-4'>
              <Avatar
                size={56}
                className='bg-primary text-surface border-surface border-4 text-lg font-bold shadow-xl'
              >
                {record.studentName?.[0].toUpperCase()}
              </Avatar>
              <div>
                <Text className='text-muted block text-xs font-bold tracking-wider uppercase'>
                  {TABLE.STUDENT}
                </Text>
                <Title level={5} className='text-text !m-0'>
                  {record.studentName || 'N/A'}
                </Title>
              </div>
            </div>

            <div className='text-right'>
              <Text className='text-muted mb-1 block text-xs font-bold tracking-wider uppercase'>
                {TABLE.STATUS}
              </Text>
              <LogbookStatusTag status={record.status} />
            </div>
          </div>

          <div className='grid gap-6'>
            <section className='bg-surface border-border overflow-hidden rounded-2xl border shadow-sm'>
              <div className='bg-muted/5 border-border flex items-center gap-2 border-b px-5 py-3'>
                <SolutionOutlined className='text-primary' />
                <Text className='text-text text-sm font-bold tracking-tight uppercase'>
                  {FORM.SUMMARY}
                </Text>
              </div>
              <div className='p-5'>
                <Paragraph className='text-text mb-0 text-[15px] leading-relaxed whitespace-pre-wrap'>
                  {record.summary || VIEW_MODAL.NO_SUMMARY}
                </Paragraph>
              </div>
            </section>

            <section className='bg-surface border-border overflow-hidden rounded-2xl border shadow-sm'>
              <div className='bg-muted/5 border-border flex items-center gap-2 border-b px-5 py-3'>
                <InfoCircleOutlined className='text-warning' />
                <Text className='text-text text-sm font-bold tracking-tight uppercase'>
                  {FORM.ISSUE}
                </Text>
              </div>
              <div className='p-5'>
                <Paragraph
                  className={`mb-0 text-[15px] leading-relaxed whitespace-pre-wrap ${record.issue ? 'text-text' : 'text-muted italic'}`}
                >
                  {record.issue || 'Không có vấn đề nào báo cáo.'}
                </Paragraph>
              </div>
            </section>

          <section className='space-y-2'>
            <h4 className='font-semibold text-gray-800'>{DAILY_REPORT_UI.FORM.ISSUE}</h4>

            <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700'>
              {record.issue || 'No issues reported.'}
            </div>
          </section>

          <section className='space-y-2'>
            <h4 className='font-semibold text-gray-800'>{DAILY_REPORT_UI.FORM.PLAN}</h4>

            <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700'>
              {record.plan || 'No plan outlined.'}
            </div>
          </section>

          {record.workItems?.length > 0 && (
            <section className='space-y-3'>
              <h4 className='font-semibold text-gray-800'>Linked Work Items</h4>
              <div className='space-y-2'>
                {record.workItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center gap-3 rounded-lg border border-slate-100 p-3'
                  >
                    <div className='h-2 w-2 rounded-full bg-blue-500' />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-slate-800'>{item.title}</p>
                      <p className='line-clamp-1 text-xs text-slate-500'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
});

export default LogbookDetailModal;
