'use client';

import { UserOutlined } from '@ant-design/icons';
import { Descriptions } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import StatusTag from './StatusTag';

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
    <CompoundModal open={open} onCancel={onCancel} width={600} destroyOnHidden footer={null}>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={student.studentFullName}
        subtitle={student.studentCode}
      />

      <div className="px-10 pb-8 pt-4">
        <Descriptions
          column={1}
          size="small"
          layout="horizontal"
          bordered={false}
          labelStyle={{
            color: 'rgba(0,0,0,0.45)',
            fontWeight: 600,
            fontSize: '11px',
            textTransform: 'uppercase',
            width: '120px',
          }}
          contentStyle={{ fontWeight: 700, fontSize: '13px', color: '#1f1f1f' }}
        >
          <Descriptions.Item label={DETAIL.STATUS}>
            <StatusTag status={displayStatus} />
          </Descriptions.Item>
          <Descriptions.Item label={DETAIL.MAJOR}>{student.major || '-'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.UNIVERSITY}>
            {student.universityName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={DETAIL.EMAIL}>{student.studentEmail || '-'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.PHONE}>
            {student.phone || '098-XXX-XXXX'}
          </Descriptions.Item>
          <Descriptions.Item label={DETAIL.DOB}>
            {student.dob ? dayjs(student.dob).format('DD/MM/YYYY') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={DETAIL.GROUP}>{student.groupName || '-'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.MENTOR}>{student.mentorName || '-'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.PROJECT}>
            {student.projectName || student.track || '-'}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted italic opacity-30">
          {DETAIL.PLACEMENT_DATE}:{' '}
          {student.appliedAt ? dayjs(student.appliedAt).format('DD/MM/YYYY') : '-'}
        </div>
      </div>
    </CompoundModal>
  );
};

export default StudentDetailModal;
