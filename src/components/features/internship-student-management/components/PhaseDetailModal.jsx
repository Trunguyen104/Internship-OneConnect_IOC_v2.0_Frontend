'use client';

import {
  ApartmentOutlined,
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const InfoRow = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-muted/50 uppercase tracking-widest flex items-center gap-1">
      {React.cloneElement(icon, { className: 'text-[9px] text-muted/40' })}
      {label}
    </span>
    <div className="bg-bg border border-border rounded-xl px-3 py-2 text-sm font-medium text-text min-h-[36px] flex items-center">
      {value ?? <span className="text-muted/30 text-xs">—</span>}
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

const PhaseStatusTag = ({ status }) => {
  const { PHASE_DETAIL } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;
  const map = {
    1: { label: PHASE_DETAIL.STATUS_OPEN, color: 'blue' },
    2: { label: PHASE_DETAIL.STATUS_IN_PROGRESS, color: 'green' },
    3: { label: PHASE_DETAIL.STATUS_CLOSED, color: 'orange' },
    0: { label: PHASE_DETAIL.STATUS_DRAFT, color: 'default' },
  };
  const cfg = map[status] ?? { label: PHASE_DETAIL.STATUS_UNKNOWN, color: 'default' };
  return (
    <Tag color={cfg.color} className="rounded-full px-3 font-semibold text-xs">
      {cfg.label}
    </Tag>
  );
};

const PhaseDetailModal = ({ open, phase, onCancel }) => {
  const { PHASE_DETAIL } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  if (!phase) return null;

  const formatDate = (d) => (d ? dayjs(d).format('DD/MM/YYYY') : null);

  return (
    <CompoundModal open={open} onCancel={onCancel} width={540} destroyOnHidden closable={false}>
      {/* Header */}
      <div className="flex flex-col items-center gap-3 pt-8 pb-5 px-6 bg-gradient-to-b from-primary-surface via-primary-surface/30 to-transparent rounded-t-3xl">
        <div className="text-center leading-tight">
          <Text className="block text-[15px] font-black text-text tracking-tight">
            {phase.name}
          </Text>
          <Text className="block text-[11px] text-muted/60 font-semibold mt-0.5">
            {phase.enterpriseName}
          </Text>
        </div>
        <PhaseStatusTag status={phase.status} />
      </div>

      {/* Content */}
      <CompoundModal.Content className="px-5 pt-4 pb-2 max-h-[52vh] overflow-y-auto no-scrollbar cursor-default">
        <div className="flex flex-col gap-5">
          {/* Enterprise & Schedule */}
          <div>
            <SectionTitle icon={<CalendarOutlined />} label={PHASE_DETAIL.SECTION_SCHEDULE} />
            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                icon={<BankOutlined />}
                label={PHASE_DETAIL.ENTERPRISE}
                value={phase.enterpriseName}
              />
              <InfoRow
                icon={<UsergroupAddOutlined />}
                label={PHASE_DETAIL.MAX_STUDENTS}
                value={phase.maxStudents ?? '—'}
              />
              <InfoRow
                icon={<CalendarOutlined />}
                label={PHASE_DETAIL.START_DATE}
                value={formatDate(phase.startDate)}
              />
              <InfoRow
                icon={<CalendarOutlined />}
                label={PHASE_DETAIL.END_DATE}
                value={formatDate(phase.endDate)}
              />
            </div>
          </div>

          {/* Statistics */}
          <div>
            <SectionTitle icon={<ApartmentOutlined />} label={PHASE_DETAIL.SECTION_STATS} />
            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                icon={<TeamOutlined />}
                label={PHASE_DETAIL.GROUP_COUNT}
                value={phase.groupCount ?? 0}
              />
            </div>
          </div>

          {/* Description */}
          {phase.description && (
            <div>
              <SectionTitle icon={<FileTextOutlined />} label={PHASE_DETAIL.SECTION_DESCRIPTION} />
              <div className="bg-bg border border-border rounded-xl px-3 py-3 text-sm text-text leading-relaxed">
                {phase.description}
              </div>
            </div>
          )}
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        confirmText={PHASE_DETAIL.CLOSE}
        onConfirm={onCancel}
        showCancel={false}
      />
    </CompoundModal>
  );
};

export default PhaseDetailModal;
