'use client';

import {
  BankOutlined,
  CalendarOutlined,
  HistoryOutlined,
  MailOutlined,
  PhoneOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import StatusTag from './StatusTag';

const { Text } = Typography;

const InfoRow = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-muted/50 uppercase tracking-widest flex items-center gap-1">
      {React.cloneElement(icon, { className: 'text-[9px] text-muted/40' })}
      {label}
    </span>
    <div className="bg-bg border border-border rounded-xl px-3 py-2 text-sm font-medium text-text min-h-[36px] flex items-center">
      {value || <span className="text-muted/30 text-xs">—</span>}
    </div>
  </div>
);

const SectionTitle = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-5 h-5 rounded-md bg-primary-surface flex items-center justify-center flex-shrink-0">
      {React.cloneElement(icon, { className: 'text-primary text-[9px]' })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">{label}</span>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const StudentDetailModal = ({ open, student, onCancel }) => {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const { DETAIL } = INTERNSHIP_LIST.MODALS;

  if (!student) return null;

  const statusMap = { 1: 'PENDING', 2: 'ACCEPTED', 3: 'REJECTED' };
  const displayStatus = statusMap[student.status] || 'PENDING';

  const initials = (student.studentFullName || '')
    .trim()
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <CompoundModal open={open} onCancel={onCancel} width={540} destroyOnHidden closable={false}>
      <div className="flex flex-col items-center gap-3 pt-8 pb-5 px-6 bg-gradient-to-b from-primary-surface via-primary-surface/30 to-transparent rounded-t-3xl">
        <div className="text-center leading-tight">
          <Text className="block text-[15px] font-black text-text tracking-tight">
            {student.studentFullName}
          </Text>
          <Text className="block text-[11px] text-muted/60 font-semibold mt-0.5">
            {student.studentCode}
            {student.major ? <span className="text-muted/30 mx-1">·</span> : null}
            {student.major}
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <StatusTag status={displayStatus} />
        </div>
      </div>

      <CompoundModal.Content className="px-5 pt-4 pb-2 max-h-[52vh] overflow-y-auto no-scrollbar cursor-default">
        <div className="flex flex-col gap-5">
          {/* Personal Information */}
          <div>
            <SectionTitle icon={<UserOutlined />} label="Personal Information" />
            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                icon={<BankOutlined />}
                label={DETAIL.UNIVERSITY}
                value={student.universityName}
              />
              <InfoRow
                icon={<MailOutlined />}
                label={DETAIL.EMAIL}
                value={
                  student.studentEmail ? (
                    <a
                      href={`mailto:${student.studentEmail}`}
                      className="text-info hover:underline truncate text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {student.studentEmail}
                    </a>
                  ) : null
                }
              />
              <InfoRow icon={<PhoneOutlined />} label={DETAIL.PHONE} value={student.phone} />
              <InfoRow
                icon={<CalendarOutlined />}
                label={DETAIL.DOB}
                value={student.dob ? dayjs(student.dob).format('DD/MM/YYYY') : null}
              />
            </div>
          </div>

          {/* Internship Details */}
          <div>
            <SectionTitle icon={<HistoryOutlined />} label="Internship Details" />
            <div className="grid grid-cols-2 gap-3">
              <InfoRow icon={<TeamOutlined />} label={DETAIL.GROUP} value={student.groupName} />
              <InfoRow
                icon={<CalendarOutlined />}
                label={DETAIL.PLACEMENT_DATE}
                value={student.appliedAt ? dayjs(student.appliedAt).format('DD/MM/YYYY') : null}
              />
              <InfoRow icon={<UserOutlined />} label={DETAIL.MENTOR} value={student.mentorName} />
              <InfoRow
                icon={<ProjectOutlined />}
                label={DETAIL.PROJECT}
                value={student.projectName || student.track}
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
