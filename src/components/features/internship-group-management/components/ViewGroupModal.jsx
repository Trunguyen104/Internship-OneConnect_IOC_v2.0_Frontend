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
            <Text className="text-[11px] font-medium leading-tight">{group.mentorName || '-'}</Text>
            {group.mentorEmail && (
              <Text className="text-muted text-[10px] opacity-60 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                {group.mentorEmail}
              </Text>
            )}
          </div>
        ),
      },
      {
        key: 'project',
        label: VIEW.PROJECT_NAME,
        children: (
          <Text className="text-[11px] font-medium leading-tight truncate block max-w-[150px]">
            {group.projectName || group.project || '-'}
          </Text>
        ),
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
          <div className="flex items-center gap-2 py-1">
            <Avatar
              size="small"
              src={s.avatar}
              icon={<UserOutlined />}
              className="bg-primary/10 text-primary"
            />
            <div className="flex flex-col leading-tight overflow-hidden">
              <Text className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis uppercase">
                {s.fullName}
              </Text>
              <Text className="text-muted text-[10px] opacity-60 truncate">{s.email}</Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: 100,
        render: (text) => <Text className="text-[11px] font-bold text-muted/80">{text}</Text>,
      },
      {
        title: 'School',
        dataIndex: 'universityName',
        key: 'universityName',
        ellipsis: true,
        render: (text) => <Text className="text-[11px] text-muted truncate">{text}</Text>,
      },
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

    const renderFooterActions = () => {
      if (isTermArchived) return null;

      return (
        <div className="flex items-center gap-2">
          {isTermActive && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => onEdit(group)}
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-primary/20 text-primary hover:bg-primary/5 transition-all"
              >
                {ENTERPRISE_GROUP_UI.ACTIONS.EDIT_GROUP}
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => onAddStudents(group)}
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-primary/20 text-primary hover:bg-primary/5 transition-all"
              >
                {ENTERPRISE_GROUP_UI.ACTIONS.ADD_STUDENTS}
              </Button>
            </>
          )}

          {(isTermActive || isTermFinished) && !hasStudents && (
            <Button
              icon={<InboxOutlined />}
              onClick={() => onArchive(group)}
              className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-warning/20 text-warning hover:bg-warning/5 transition-all"
            >
              {ENTERPRISE_GROUP_UI.ACTIONS.ARCHIVE_GROUP}
            </Button>
          )}

          {isTermActive && !hasStudents && (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDelete(group)}
              className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-danger/20 text-danger hover:bg-danger/5 transition-all"
            >
              {ENTERPRISE_GROUP_UI.ACTIONS.DELETE_GROUP}
            </Button>
          )}
        </div>
      );
    };

    return (
      <CompoundModal open={open} onCancel={onCancel} width={720} destroyOnHidden closable={false}>
        <CompoundModal.Header
          icon={<TeamOutlined />}
          title={group.name}
          subtitle={group.track || VIEW.DEFAULT_SUBTITLE}
        />

        <CompoundModal.Content className="px-8 py-6 max-h-[60vh] overflow-y-auto mt-2">
          <Descriptions
            items={items}
            column={2}
            size="small"
            bordered={false}
            labelStyle={{
              width: '135px',
              color: 'var(--text)',
              fontWeight: 800,
              fontSize: '11px',
              textTransform: 'uppercase',
              paddingBottom: '12px',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
            contentStyle={{
              color: 'var(--muted)',
              fontWeight: 500,
              fontSize: '11px',
              paddingBottom: '12px',
              paddingLeft: '8px',
            }}
          />

          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TeamOutlined className="text-primary text-sm" />
                <Text className="text-[10px] font-extrabold uppercase tracking-widest text-muted/50">
                  {VIEW.MEMBERS} ({group.memberCount})
                </Text>
              </div>
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
        </CompoundModal.Content>

        <CompoundModal.Footer
          onCancel={onCancel}
          confirmText={VIEW.CLOSE}
          onConfirm={onCancel}
          showCancel={false}
        >
          {renderFooterActions()}
        </CompoundModal.Footer>
      </CompoundModal>
    );
  }
);
ViewGroupModal.displayName = 'ViewGroupModal';

export default ViewGroupModal;
