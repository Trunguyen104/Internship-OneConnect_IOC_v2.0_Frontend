import {
  BankOutlined,
  DeleteOutlined,
  MailOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import { GROUP_STATUS } from '@/constants/internship-management/internship-management';

export const GroupMembersTable = ({
  members,
  searchQuery,
  onSearchChange,
  info,
  onAddStudent,
  onRemoveStudent,
  groupId,
  VIEW,
}) => {
  return (
    <Card className="!p-6 border-none shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-text/80 mb-0">
            {VIEW.MEMBERS}
          </h3>
        </div>
        <div className="ml-5 flex flex-1">
          <Input
            placeholder="Search students..."
            allowClear
            prefix={<SearchOutlined className="text-muted/40 text-xs" />}
            size="small"
            className="w-48 !rounded-full max-w-[300px] text-[11px] h-8 bg-slate-50 border-slate-100 hover:border-primary focus:border-primary transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm whitespace-nowrap">
            {members.length} {VIEW.STUDENTS_SUFFIX}
          </span>
          {info.status === GROUP_STATUS.ACTIVE && (
            <button
              onClick={onAddStudent}
              className="bg-primary hover:bg-primary-hover flex h-8 shrink-0 items-center gap-2 rounded-full px-5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-95 cursor-pointer border-none outline-none whitespace-nowrap"
            >
              <UsergroupAddOutlined className="text-sm" />
              {VIEW.TABLE.ADD_STUDENT}
            </button>
          )}
        </div>
      </div>

      <Table
        dataSource={members}
        rowKey="id"
        pagination={false}
        size="small"
        className="rounded-xl overflow-hidden border border-slate-100 shadow-sm"
        columns={[
          {
            title: (
              <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                {VIEW.TABLE.CODE}
              </span>
            ),
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text) => <span className="text-xs font-bold text-text/70">{text}</span>,
          },
          {
            title: (
              <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                {VIEW.TABLE.FULL_NAME}
              </span>
            ),
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span className="text-sm font-black text-text">{text}</span>,
          },
          {
            title: (
              <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                {VIEW.TABLE.EMAIL}
              </span>
            ),
            dataIndex: 'email',
            key: 'email',
            render: (text) => (
              <div className="flex items-center gap-1.5 opacity-60">
                <MailOutlined className="text-[10px]" />
                <span className="text-xs font-medium">{text}</span>
              </div>
            ),
          },
          {
            title: (
              <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                {VIEW.TABLE.SCHOOL}
              </span>
            ),
            dataIndex: 'universityName',
            key: 'universityName',
            render: (text) => (
              <div className="flex items-center gap-1.5 opacity-60 truncate max-w-[200px]">
                <BankOutlined className="text-[10px]" />
                <span className="text-xs font-medium">{text}</span>
              </div>
            ),
          },
          {
            title: (
              <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                {VIEW.TABLE.ACTION || 'ACTION'}
              </span>
            ),
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, student) => (
              <div className="flex items-center justify-center">
                {info.status === GROUP_STATUS.ACTIVE ? (
                  <Button
                    type="text"
                    danger
                    size="small"
                    className="hover:bg-danger/5"
                    icon={<DeleteOutlined className="text-xs" />}
                    onClick={() => onRemoveStudent && onRemoveStudent(groupId, student.id)}
                  />
                ) : (
                  <span className="text-muted/30 text-[10px]">-</span>
                )}
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};
