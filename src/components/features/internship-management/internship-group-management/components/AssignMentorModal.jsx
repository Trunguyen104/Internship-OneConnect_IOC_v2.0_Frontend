'use client';

import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Modal, Select, Spin } from 'antd';
import React, { useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

export const AssignMentorModal = ({
  open,
  group,
  mentors = [],
  loading = false,
  onCancel,
  onConfirm,
}) => {
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const isChange = !!group?.mentorId && group?.mentorName && group?.mentorName !== '-';
  const UI = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS.ASSIGN;

  const handleConfirm = () => {
    if (selectedMentorId) {
      onConfirm({ mentorId: selectedMentorId });
    }
  };

  const mentorOptions = mentors.map((m) => ({
    label: (
      <div className="flex flex-col py-1">
        <span className="text-sm font-bold text-slate-700">{m.fullName || m.name}</span>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
          <span className="truncate">{m.email}</span>
        </div>
      </div>
    ),
    value: m.userId || m.UserId || m.id,
    disabled: (m.userId || m.UserId || m.id) === group?.mentorId,
    searchLabel: `${m.fullName || m.name} ${m.email}`, // Custom field for easier searching
  }));

  const isEmpty = mentors.length === 0 && !loading;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 py-1">
          <UserOutlined className="text-primary" />
          <span className="text-base font-extrabold uppercase tracking-wider text-slate-800">
            {isChange ? UI.TITLE_CHANGE : UI.TITLE_ASSIGN}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText={isChange ? UI.CONFIRM_CHANGE : UI.CONFIRM}
      okButtonProps={{
        disabled: !selectedMentorId || isEmpty,
        className: 'bg-primary hover:bg-primary-hover border-none font-bold min-w-[100px]',
      }}
      cancelButtonProps={{ className: 'font-semibold' }}
      destroyOnHidden
      centered
      width={480}
      className="custom-modal"
    >
      <div className="flex flex-col gap-6 py-4">
        {/* Group Info Context */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {UI.TARGET_GROUP}
          </span>
          <span className="text-sm font-bold text-slate-800">
            {group?.name || group?.groupName}
          </span>
        </div>

        {isChange && (
          <Alert
            type="warning"
            showIcon
            icon={<InfoCircleOutlined />}
            title={
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-amber-800">{UI.REPLACEMENT_WARNING}</span>
                <p className="text-[11px] leading-relaxed text-amber-700 mb-0">
                  {UI.REPLACEMENT_CONTENT}
                </p>
              </div>
            }
            className="rounded-xl border-amber-100 bg-amber-50/50"
          />
        )}

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            {isChange ? UI.SELECT_NEW_MENTOR : UI.MENTOR_LABEL}
          </label>
          <Select
            showSearch
            placeholder={isEmpty ? UI.NO_MENTORS_AVAILABLE : UI.MENTOR_PLACEHOLDER}
            loading={loading}
            disabled={isEmpty}
            className="w-full h-12 shadow-sm"
            value={selectedMentorId}
            onChange={setSelectedMentorId}
            filterOption={(input, option) =>
              option?.searchLabel?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            notFoundContent={
              loading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2">
                  <Spin size="small" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {UI.FETCHING_MENTORS}
                  </span>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <UserOutlined className="text-2xl opacity-20" />
                  <span className="text-xs font-medium italic">{UI.NO_MENTORS_FOUND}</span>
                </div>
              )
            }
            options={mentorOptions}
            classNames={{ popup: { root: 'mentor-select-popup' } }}
          />
          {isEmpty && (
            <p className="text-[11px] text-rose-500 font-medium italic mt-1 ml-1 leading-tight">
              {UI.NO_MENTORS_ERROR}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
