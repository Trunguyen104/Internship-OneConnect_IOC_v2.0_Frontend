'use client';

import { UserOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { MOCK_GROUPS, MOCK_MENTORS } from '../constants/internshipData';
import SimpleDetailItem from './SimpleDetailItem';
import StatusTag from './StatusTag';

const StudentDetailModal = ({ open, student, onCancel }) => {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const { DETAIL } = INTERNSHIP_LIST.MODALS;

  if (!student) return null;

  const group = MOCK_GROUPS.find((g) => g.id === student.groupId);
  const mentor = MOCK_MENTORS.find((m) => m.id === student.mentorId);

  return (
    <CompoundModal open={open} onCancel={onCancel} width={500} destroyOnHidden footer={null}>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={student.fullName}
        subtitle={student.studentId}
      />

      <div className="px-10 py-10">
        <Row gutter={[32, 32]}>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.MAJOR} value={student.major} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.STATUS} value={<StatusTag status={student.status} />} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.EMAIL} value={student.email} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.PHONE} value={student.phone || '098-XXX-XXXX'} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.DOB} value={student.dob || '01/01/2002'} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.GROUP} value={group?.name} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={DETAIL.MENTOR} value={mentor?.name} />
          </Col>
          {student.placedDate && (
            <Col span={12}>
              <SimpleDetailItem
                label={DETAIL.PLACEMENT_DATE}
                value={new Date(student.placedDate).toLocaleDateString('en-US')}
              />
            </Col>
          )}
        </Row>

        <CompoundModal.Footer
          cancelText={DETAIL.CLOSE}
          onCancel={onCancel}
          confirmText={null}
          className="mt-12 flex justify-center border-none pt-0"
        />
      </div>
    </CompoundModal>
  );
};

export default StudentDetailModal;
