import { CodeOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Tag, Tooltip } from 'antd';
import React, { memo } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { cn } from '@/lib/cn';

import { MOCK_MENTORS } from '../constants/groupData';

const GroupCardRoot = ({ children, className, isArchived, ...props }) => (
  <div
    className={cn(
      'bg-surface border-border group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
      isArchived ? 'opacity-60 grayscale-[50%]' : 'opacity-100',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const GroupCardHeader = ({ children, className }) => (
  <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>
);

const GroupCardBody = ({ children, className, onClick }) => (
  <div className={cn('flex-1 cursor-pointer', className)} onClick={onClick}>
    {children}
  </div>
);

const GroupCardFooter = ({ children, className }) => (
  <div
    className={cn(
      'border-border mt-6 flex items-center justify-between border-t border-dashed pt-4',
      className
    )}
  >
    {children}
  </div>
);

const GroupCardActions = ({ children, className }) => (
  <div
    className={cn(
      'bg-muted/5 border-border -mx-6 mt-6 -mb-6 flex divide-x border-t transition-all group-hover:bg-transparent',
      className
    )}
  >
    {children}
  </div>
);

const GroupCard = memo(({ group, onAssign, onDelete, onView }) => {
  const { CARD } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;
  const mentor = MOCK_MENTORS.find((m) => m.id === group.mentorId);
  const isArchived = group.status === 'ARCHIVED';

  return (
    <GroupCardRoot isArchived={isArchived}>
      <GroupCardHeader>
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
          <CodeOutlined className="text-primary text-xl" />
        </div>

        <div className="flex items-center gap-2">
          <Tag
            color={group.status === 'ACTIVE' ? 'success' : 'default'}
            className="border-none px-3 py-0.5 text-[10px] font-black tracking-widest uppercase"
          >
            {INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT[group.status] || group.status}
          </Tag>

          <Tooltip title={CARD.DELETE_TOOLTIP}>
            <Button
              type="text"
              icon={
                <DeleteOutlined className="text-muted group-hover:text-danger transition-colors" />
              }
              onClick={(e) => {
                e.stopPropagation();
                onDelete(group);
              }}
              className="hover:bg-danger/10 flex size-8 items-center justify-center rounded-lg p-0 transition-all"
            />
          </Tooltip>
        </div>
      </GroupCardHeader>

      <GroupCardBody onClick={() => onView(group)}>
        <h3 className="text-text mb-2 truncate text-lg leading-tight font-bold tracking-tight capitalize">
          {group.name}
        </h3>

        <div className="flex items-center gap-2">
          {mentor ? (
            <UserOutlined className="text-primary text-xs" />
          ) : (
            <PlusOutlined className="text-muted text-xs" />
          )}
          <span className="text-muted text-xs font-semibold">
            {CARD.MENTOR_LABEL}{' '}
            <span className={mentor ? 'text-text' : 'font-normal italic'}>
              {mentor?.name || CARD.NOT_ASSIGNED}
            </span>
          </span>
        </div>
      </GroupCardBody>

      <GroupCardFooter>
        <Avatar.Group max={{ count: 4 }} size="small">
          {(group.avatars || []).map((url, i) => (
            <Avatar key={i} src={url} className="border-surface border-2 shadow-sm" />
          ))}
          {(!group.avatars || group.avatars.length === 0) && group.memberCount > 0 && (
            <Avatar icon={<UserOutlined />} className="bg-muted/20 text-muted" />
          )}
        </Avatar.Group>

        <span className="text-muted text-xs font-bold italic">
          {group.memberCount} {CARD.MEMBERS_SUFFIX}
        </span>
      </GroupCardFooter>

      <GroupCardActions>
        <button
          disabled={isArchived}
          onClick={() => onAssign(group)}
          className="text-primary hover:bg-primary/5 flex flex-1 items-center justify-center py-4 text-xs font-bold transition-all disabled:opacity-50"
        >
          {mentor ? CARD.CHANGE_MENTOR : CARD.ASSIGN_MENTOR}
        </button>
        <button
          onClick={() => onView(group)}
          className="text-muted hover:bg-muted/5 flex flex-1 items-center justify-center py-4 text-xs font-bold transition-all"
        >
          {isArchived ? CARD.VIEW_ARCHIVE : CARD.VIEW_DETAILS}
        </button>
      </GroupCardActions>
    </GroupCardRoot>
  );
});

Object.assign(GroupCard, {
  Root: GroupCardRoot,
  Header: GroupCardHeader,
  Body: GroupCardBody,
  Footer: GroupCardFooter,
  Actions: GroupCardActions,
});

export { GroupCard };
