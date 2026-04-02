'use client';

import { ExclamationCircleOutlined, UsergroupAddOutlined } from '@ant-design/icons';
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
  unstartedProjects = [],
  selectedGroupId,
  setSelectedGroupId,
  replacementProjectId,
  setReplacementProjectId,
}) {
  const sourceGroupId =
    assigningProject?.internshipId ||
    assigningProject?.internshipGroupId ||
    assigningProject?.groupId;

  const isMovingFromGroup =
    sourceGroupId && sourceGroupId !== '00000000-0000-0000-0000-000000000000';

  const sourceGroup = groups.find((g) => (g.internshipId || g.id) === sourceGroupId);

  const canConfirm =
    selectedGroupId &&
    (!isMovingFromGroup ||
      selectedGroupId === sourceGroupId ||
      sourceGroup?.studentCount === 0 ||
      sourceGroup?.numberOfMembers === 0 ||
      assigningProject?.groupInfo?.studentCount === 0 ||
      replacementProjectId);

  return (
    <Modal
      title={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.TITLE}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
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
          {groups.map((g) => (
            <Option key={g.internshipId || g.id} value={g.internshipId || g.id}>
              {g.groupName}
            </Option>
          ))}
        </Select>

        {/* AC-05: Case B - Replacement selection if it's a move */}
        {isMovingFromGroup && selectedGroupId && selectedGroupId !== sourceGroupId && (
          <div className="mt-6 border-t pt-4">
            <div className="mb-3 flex items-start gap-2 rounded-md bg-amber-50 p-3">
              <span className="text-amber-500 mt-0.5">
                <ExclamationCircleOutlined />
              </span>
              <p
                className="text-xs text-amber-800"
                dangerouslySetInnerHTML={{
                  __html: PROJECT_MANAGEMENT.MODALS.ASSIGN_GROUP.SWAP_WARNING.replaceAll(
                    '{projectName}',
                    assigningProject?.projectName || ''
                  )
                    .replaceAll(
                      '{groupName}',
                      sourceGroup?.groupName ||
                        PROJECT_MANAGEMENT.MODALS.ASSIGN_GROUP.CURRENT_GROUP.toLowerCase()
                    )
                    .replaceAll(
                      '{count}',
                      String(
                        assigningProject?.studentCount || assigningProject?.numberOfMembers || 0
                      )
                    ),
                }}
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/50 mb-4">
              <div className="size-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                <UsergroupAddOutlined />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                  {PROJECT_MANAGEMENT.MODALS.ASSIGN_GROUP.CURRENT_GROUP}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {sourceGroup?.groupName || PROJECT_MANAGEMENT.MODALS.ASSIGN_GROUP.CURRENT_GROUP}
                </span>
              </div>
            </div>

            <div className="font-medium text-xs text-gray-500 mb-1.5 uppercase tracking-wider">
              {PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.REPLACEMENT_LABEL.replaceAll(
                '{groupName}',
                sourceGroup?.groupName || PROJECT_MANAGEMENT.MODALS.ASSIGN_GROUP.CURRENT_GROUP
              )}
            </div>
            <Select
              className="w-full"
              placeholder={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.REPLACEMENT_PLACEHOLDER}
              value={replacementProjectId}
              onChange={setReplacementProjectId}
              allowClear
            >
              {unstartedProjects.map((p) => (
                <Option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </Option>
              ))}
            </Select>
            {unstartedProjects.length === 0 && (
              <p className="mt-1 text-[10px] italic text-red-400">
                {PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.NO_UNSTARTED_PROJECTS.replaceAll(
                  '{groupName}',
                  sourceGroup?.groupName || ''
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
