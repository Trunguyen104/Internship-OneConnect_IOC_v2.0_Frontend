'use client';

import {
  ArrowLeftOutlined,
  BankOutlined,
  BlockOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  MailOutlined,
  ProjectOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Empty, Input, Spin, Table, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import StatusBadge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import {
  GROUP_STATUS,
  GROUP_STATUS_VARIANTS,
} from '@/constants/internship-management/internship-management';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { useGroupDetail } from '../hooks/useGroupDetail';

const { Text, Title } = Typography;

export default function GroupGeneralInfo({
  groupId = null,
  onBack = null,
  onRemoveStudent = null,
  onAddStudent = null,
}) {
  const { info, loading } = useGroupDetail(groupId);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const VIEW = ENTERPRISE_GROUP_UI.MODALS.VIEW;

  const members = info?.members || [];

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;

    const query = searchQuery.toLowerCase().trim();
    return members.filter(
      (m) =>
        m.fullName?.toLowerCase().includes(query) ||
        m.code?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/internship-groups');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 min-h-[400px]">
        <Spin size="large" description={ENTERPRISE_GROUP_UI.MESSAGES.LOAD_ERROR} />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 min-h-[400px]">
        <Empty description={ENTERPRISE_GROUP_UI.EMPTY_STATE.MESSAGE} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-start">
        <Button
          type="text"
          size="small"
          icon={<ArrowLeftOutlined className="text-xs" />}
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-600 hover:text-primary font-bold text-xs hover:bg-primary/10 rounded-lg px-3 h-9 transition-all shadow-sm bg-slate-100/80 border border-slate-200/50"
        >
          {ENTERPRISE_GROUP_UI.ACTIONS.BACK_TO_LIST}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Column (Left) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="!p-6 border-none shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <BlockOutlined />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-text/80 mb-0">
                  {VIEW.TITLE}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {/* Group Metadata in vertical grid style */}
              <div className="flex flex-col gap-1.5">
                <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                  {VIEW.GROUP_NAME}
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center">
                  {info.groupName || '-'}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                  {VIEW.STATUS}
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm min-h-[44px] flex items-center">
                  <StatusBadge variant={GROUP_STATUS_VARIANTS[info.status] || 'default'} size="sm">
                    {ENTERPRISE_GROUP_UI.STATUS.LABELS[info.status] || info.status || '-'}
                  </StatusBadge>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                  {VIEW.MENTOR}
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center">
                  <div className="flex flex-col">
                    <span>{info.mentorName || VIEW.NOT_ASSIGNED}</span>
                    {info.mentorEmail && (
                      <span className="text-[10px] text-muted/60 font-medium">
                        {info.mentorEmail}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                  {VIEW.PROJECT_NAME}
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center">
                  <div className="flex items-center gap-2">
                    <ProjectOutlined className="text-primary/40" />
                    <span className="truncate">{info.project?.name || VIEW.NOT_ASSIGNED}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-muted/60 text-[10px] font-bold uppercase tracking-widest ml-1">
                  {VIEW.ENTERPRISE}
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-text shadow-sm min-h-[44px] flex items-center text-xs truncate">
                  {info.enterpriseName || '-'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Column (Right) */}
        <div className="flex flex-col gap-6">
          <Card className="!p-6 border-none shadow-sm flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                <InfoCircleOutlined />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-text/80 mb-0">
                {VIEW.DESCRIPTION}
              </h3>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-xs font-medium leading-relaxed text-muted flex-1 min-h-[150px]">
              {info.description || info.projectDescription || VIEW.NOT_ASSIGNED}
            </div>
          </Card>
        </div>
      </div>

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm whitespace-nowrap">
              {filteredMembers.length} {VIEW.STUDENTS_SUFFIX}
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
          dataSource={filteredMembers}
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
    </div>
  );
}
