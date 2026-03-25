'use client';

import { HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
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

      <CompoundModal.Content className="px-5 py-2 max-h-[60vh] overflow-y-auto no-scrollbar cursor-default">
        <div className="flex flex-col gap-1">
          <div className="mb-2 flex items-center gap-2 opacity-50">
            <UserOutlined className="text-primary text-[10px]" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              Personal Information
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1 line-clamp-1">
                {DETAIL.UNIVERSITY}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.universityName || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1 line-clamp-1">
                {DETAIL.EMAIL}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center truncate">
                {student.studentEmail || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.PHONE}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.phone || '098-XXX-XXXX'}
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.DOB}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.dob ? dayjs(student.dob).format('DD/MM/YYYY') : '-'}
              </div>
            </div>
          </div>

          {/* Section: Internship Information */}
          <div className="mt-1 mb-2 flex items-center gap-2 opacity-50">
            <HistoryOutlined className="text-primary text-[10px]" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              Internship Details
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.STATUS}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1 text-xs font-semibold text-text min-h-[32px] flex items-center">
                <StatusTag status={displayStatus} />
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1 line-clamp-1">
                {DETAIL.PLACEMENT_DATE}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.appliedAt ? dayjs(student.appliedAt).format('DD/MM/YYYY') : '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.MAJOR}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.major || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.GROUP}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.groupName || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.MENTOR}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.mentorName || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold text-muted/60 uppercase ml-1">
                {DETAIL.PROJECT}
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-text min-h-[32px] flex items-center">
                {student.projectName || student.track || '-'}
              </div>
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
