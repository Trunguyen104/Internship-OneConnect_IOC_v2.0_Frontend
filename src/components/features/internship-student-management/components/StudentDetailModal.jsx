'use client';

import { UserOutlined } from '@ant-design/icons';
import { Descriptions, Typography } from 'antd';
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
    0: 'PENDING',
    1: 'ACCEPTED',
    2: 'REJECTED',
  };
  const displayStatus = statusMap[student.status] || 'PENDING';

  return (
    <CompoundModal open={open} onCancel={onCancel} width={500} destroyOnHidden footer={null}>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={student.studentFullName}
        subtitle={student.studentCode}
      />

      <div className="px-10 pb-6 pt-4">
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
          <Descriptions.Item label={DETAIL.DOB}>{student.dob || '01/01/2002'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.GROUP}>{student.groupName || '-'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.MENTOR}>{student.mentorName || '-'}</Descriptions.Item>
          <Descriptions.Item label={DETAIL.PROJECT}>
            {student.projectName || student.track || '-'}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-4 flex justify-end text-[10px] uppercase tracking-wider text-muted italic opacity-30">
          {DETAIL.PLACEMENT_DATE}:{' '}
          {student.appliedAt ? new Date(student.appliedAt).toLocaleDateString('en-GB') : '-'}
        </div>
      </div>
    </CompoundModal>
  );
};

export default StudentDetailModal;
