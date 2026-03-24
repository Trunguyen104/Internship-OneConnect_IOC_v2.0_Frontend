import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Descriptions, Table, Tooltip, Typography } from 'antd';
import React, { memo } from 'react';

import StatusBadge from '@/components/ui/badge';
import CompoundModal from '@/components/ui/CompoundModal';
import {
  GROUP_STATUS,
  GROUP_STATUS_VARIANTS,
  INTERNSHIP_MANAGEMENT_UI,
} from '@/constants/internship-management/internship-management';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';

const { Text } = Typography;

export const ViewGroupModal = memo(
  ({
    open,
    group,
    loading = false,
    onCancel,
    onEdit,
    onAddStudents,
    onArchive,
    onDelete,
    onRemoveStudent,
  }) => {
    const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
    const { VIEW } = GROUP_MANAGEMENT.MODALS;

    if (!group) return null;

    const items = [
      {
        key: 'track',
        label: VIEW.TRACK,
        children: group.track || '-',
      },
      {
        key: 'status',
        label: VIEW.STATUS,
        children: (
          <StatusBadge variant={GROUP_STATUS_VARIANTS[group.status] || 'default'} size="sm">
            {GROUP_MANAGEMENT.FILTERS.STATUS_OPTIONS.find((o) => o.value === group.status)?.label ||
              '-'}
          </StatusBadge>
        ),
      },
      {
        key: 'term',
        label: VIEW.TERM,
        children: group.termName || group.term || '-',
      },
      {
        key: 'mentor',
        label: VIEW.MENTOR,
        children: (
          <div className="flex flex-col">
            <Text className="text-[13px] font-bold">{group.mentorName || '-'}</Text>
            {group.mentorEmail && (
              <Text className="text-muted text-[10px] opacity-60 font-medium">
                {group.mentorEmail}
              </Text>
            )}
          </div>
        ),
      },
      {
        key: 'project',
        label: VIEW.PROJECT_NAME,
        children: group.projectName || group.project || '-',
      },
      {
        key: 'description',
        label: GROUP_MANAGEMENT.MODALS.CREATE.DESCRIPTION_LABEL,
        children: group.description || '-',
        span: 2,
      },
    ];

    const columns = [
      {
        title: 'Member',
        key: 'member',
        render: (_, s) => (
          <div className="flex items-center gap-2">
            <Avatar size="small" src={s.avatar} icon={<UserOutlined />} />
            <div className="flex flex-col leading-tight overflow-hidden">
              <Text className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {s.fullName}
              </Text>
              <Text className="text-muted text-[10px] opacity-60 truncate">{s.email}</Text>
            </div>
          </div>
        ),
      },
      { title: 'Code', dataIndex: 'code', key: 'code', width: 90 },
      { title: 'School', dataIndex: 'universityName', key: 'universityName', ellipsis: true },
    ];

    if (group.status === GROUP_STATUS.ACTIVE) {
      columns.push({
        key: 'actions',
        width: 50,
        align: 'center',
        render: (_, s) => (
          <Tooltip title="Remove Student">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined className="text-[12px]" />}
              onClick={() => onRemoveStudent(group.id, s.id)}
              className="flex items-center justify-center opacity-40 hover:opacity-100"
            />
          </Tooltip>
        ),
      });
    }

    const isTermActive = group.status === GROUP_STATUS.ACTIVE;
    const isTermFinished = group.status === GROUP_STATUS.FINISHED;
    const isTermArchived = group.status === GROUP_STATUS.ARCHIVED;
    const hasStudents = (group.members || []).length > 0;

    return (
      <CompoundModal open={open} onCancel={onCancel} width={700} destroyOnHidden footer={null}>
        <CompoundModal.Header
          icon={<TeamOutlined />}
          title={group.name}
          subtitle={group.track || VIEW.DEFAULT_SUBTITLE}
        />

        <div className="px-8 py-6">
          <Descriptions
            items={items}
            column={2}
            size="small"
            bordered={false}
            labelStyle={{
              width: '100px',
              color: 'var(--muted)',
              fontWeight: '600',
              fontSize: '11px',
              textTransform: 'uppercase',
              paddingBottom: '8px',
            }}
            contentStyle={{
              color: 'var(--text)',
              fontWeight: '700',
              fontSize: '13px',
              paddingBottom: '8px',
            }}
          />

          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-3">
              <Text className="text-muted text-[11px] font-bold uppercase tracking-wider">
                {VIEW.MEMBERS} ({group.memberCount})
              </Text>
            </div>

            <Table
              dataSource={group.members || []}
              columns={columns}
              loading={loading}
              pagination={false}
              size="small"
              rowKey="id"
              scroll={{ y: 240 }}
              className="group-members-table custom-table-minimal"
            />
          </div>

          {/* Action Buttons based on AC-G03 */}
          {!isTermArchived && (
            <div className="mt-8 pt-6 border-t flex flex-wrap items-center justify-end gap-3">
              {isTermActive && (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => onEdit(group)}
                    className="rounded-xl font-bold text-xs flex items-center gap-1.5 px-4 h-10 border-primary/20 text-primary hover:bg-primary/5 transition-all"
                  >
                    {ENTERPRISE_GROUP_UI.ACTIONS.EDIT_GROUP}
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => onAddStudents(group)}
                    className="rounded-xl font-bold text-xs flex items-center gap-1.5 px-4 h-10 border-primary/20 text-primary hover:bg-primary/5 transition-all"
                  >
                    {ENTERPRISE_GROUP_UI.ACTIONS.ADD_STUDENTS}
                  </Button>
                </>
              )}

              {/* Archive button: shown for Active, and still shown for Finished if 0 Students (AC-G07 Exception) */}
              {(isTermActive || isTermFinished) && !hasStudents && (
                <Button
                  icon={<InboxOutlined />}
                  onClick={() => onArchive(group)}
                  className="rounded-xl font-bold text-xs flex items-center gap-1.5 px-4 h-10 border-warning/20 text-warning hover:bg-warning/5 transition-all"
                >
                  {ENTERPRISE_GROUP_UI.ACTIONS.ARCHIVE_GROUP}
                </Button>
              )}

              {/* Delete button: Active & 0 students (Requirement AC-G03 says 0 SV and 0 data) */}
              {isTermActive && !hasStudents && (
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => onDelete(group)}
                  className="rounded-xl font-bold text-xs flex items-center gap-1.5 px-4 h-10 border-danger/20 text-danger hover:bg-danger/5 transition-all"
                >
                  {ENTERPRISE_GROUP_UI.ACTIONS.DELETE_GROUP}
                </Button>
              )}

              <Button
                onClick={onCancel}
                className="rounded-xl font-extrabold text-[#747474] text-[12px] uppercase tracking-wider px-6 h-10 bg-surface border-border hover:border-muted transition-all"
              >
                {VIEW.CLOSE}
              </Button>
            </div>
          )}
          {isTermArchived && (
            <div className="mt-8 pt-6 border-t flex justify-end">
              <Button
                onClick={onCancel}
                className="rounded-xl font-extrabold text-[#747474] text-[12px] uppercase tracking-wider px-6 h-10 bg-surface border-border hover:border-muted transition-all"
              >
                {VIEW.CLOSE}
              </Button>
            </div>
          )}
        </div>
      </CompoundModal>
    );
  }
);
ViewGroupModal.displayName = 'ViewGroupModal';
