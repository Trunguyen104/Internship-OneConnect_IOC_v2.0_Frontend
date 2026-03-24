'use client';

import { HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { Descriptions, Divider, Empty, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import StatusTag from './StatusTag';

const { Text } = Typography;

const StudentDetailModal = ({ open, student, onCancel }) => {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const { DETAIL } = INTERNSHIP_LIST.MODALS;

  if (!student) return null;

  const statusMap = {
    1: 'PENDING',
    2: 'ACCEPTED',
    3: 'REJECTED',
  };
  const displayStatus = statusMap[student.status] || 'PENDING';

  return (
    <CompoundModal open={open} onCancel={onCancel} width={600} destroyOnHidden closable={false}>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={student.studentFullName}
        subtitle={student.studentCode}
      />

      <CompoundModal.Content className="px-8 py-6 max-h-[60vh] overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Section: Personal Information */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <UserOutlined className="text-primary text-sm" />
              <Text className="text-[11px] font-extrabold uppercase tracking-widest text-muted/60">
                Personal Information
              </Text>
            </div>
            <Descriptions
              column={1}
              size="small"
              bordered={false}
              labelStyle={{
                color: 'var(--text)',
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                width: '140px',
                whiteSpace: 'nowrap',
              }}
              contentStyle={{ fontWeight: 500, fontSize: '11px', color: 'var(--muted)' }}
            >
              <Descriptions.Item label={DETAIL.UNIVERSITY}>
                {student.universityName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={DETAIL.EMAIL}>
                {student.studentEmail || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={DETAIL.PHONE}>
                {student.phone || '098-XXX-XXXX'}
              </Descriptions.Item>
              <Descriptions.Item label={DETAIL.DOB}>
                {student.dob ? dayjs(student.dob).format('DD/MM/YYYY') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider className="my-0 opacity-20" />

          {/* Section: Internship Information */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <HistoryOutlined className="text-primary text-sm" />
              <Text className="text-[11px] font-extrabold uppercase tracking-widest text-muted/60">
                Internship Details
              </Text>
            </div>
            <Descriptions
              column={1}
              size="small"
              bordered={false}
              labelStyle={{
                color: 'var(--text)',
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                width: '140px',
                whiteSpace: 'nowrap',
              }}
              contentStyle={{ fontWeight: 500, fontSize: '11px', color: 'var(--muted)' }}
            >
              <Descriptions.Item label={DETAIL.STATUS}>
                <StatusTag status={displayStatus} />
              </Descriptions.Item>
              <Descriptions.Item label={DETAIL.PLACEMENT_DATE}>
                {student.appliedAt ? dayjs(student.appliedAt).format('DD/MM/YYYY') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={DETAIL.MAJOR}>{student.major || '-'}</Descriptions.Item>
              <Descriptions.Item label={DETAIL.GROUP}>{student.groupName || '-'}</Descriptions.Item>
              <Descriptions.Item label={DETAIL.MENTOR}>
                {student.mentorName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={DETAIL.PROJECT}>
                {student.projectName || student.track || '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider className="my-0 opacity-20" />

          {/* Section: Change History (AC-S05) */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <HistoryOutlined className="text-primary text-sm" />
              <Text className="text-[11px] font-extrabold uppercase tracking-widest text-muted/60">
                Change History
              </Text>
            </div>
            <div className="rounded-xl border border-dashed border-border p-3 bg-bg/30">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-[10px] uppercase font-bold text-muted/40 tracking-tighter italic">
                    History recording disabled
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        confirmText={INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS.VIEW.CLOSE}
        onConfirm={onCancel}
        showCancel={false}
      />
    </CompoundModal>
  );
};

export default StudentDetailModal;
