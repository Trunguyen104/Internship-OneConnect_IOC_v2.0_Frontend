'use client';

import { Modal, Select } from 'antd';
import React from 'react';

import { PROJECT_MANAGEMENT } from '@/constants/project-management/project-management';

const { Option } = Select;

export default function ProjectAssignGroupModal({
  visible,
  onCancel,
  onConfirm,
  loading,
  assigningProject,
  groups = [],
  selectedGroupId,
  setSelectedGroupId,
}) {
  const canConfirm = !!selectedGroupId;

  return (
    <Modal
      title={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.TITLE}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      centered
      zIndex={2000}
      okButtonProps={{
        disabled: !canConfirm,
      }}
      okText={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM}
    >
      <div className="py-4">
        <p
          className="mb-2 text-sm text-gray-600"
          dangerouslySetInnerHTML={{
            __html: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.DESC.replaceAll(
              '{name}',
              assigningProject?.projectName || ''
            ),
          }}
        />
        <Select
          className="w-full"
          placeholder={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.PLACEHOLDER}
          value={selectedGroupId}
          onChange={setSelectedGroupId}
          allowClear
        >
          {groups
            .filter((g) => {
              const groupId = g.internshipId || g.id;
              // Quy tắc 1-1: Nhóm chỉ hiển thị nếu chưa có dự án nào khác
              // (Sử dụng flag projectId hoặc hasProject từ API)
              const isCurrentGroup =
                assigningProject?.internshipId === groupId ||
                assigningProject?.internshipGroupId === groupId ||
                assigningProject?.groupId === groupId;

              const isTakenByOther = g.projectId && g.projectId !== assigningProject?.projectId;

              return !isTakenByOther || isCurrentGroup;
            })
            .map((g) => (
              <Option key={g.internshipId || g.id} value={g.internshipId || g.id}>
                {g.groupName}
              </Option>
            ))}
        </Select>
      </div>
    </Modal>
  );
}
