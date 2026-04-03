'use client';

import {
  ArrowLeftOutlined,
  BankOutlined,
  DeleteOutlined,
  MailOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Empty, Input, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import Card from '@/components/ui/card';
import DataTable from '@/components/ui/datatable';
import {
  GROUP_STATUS,
  INTERNSHIP_MANAGEMENT_UI,
} from '@/constants/internship-management/internship-management';
import { TABLE_CELL } from '@/lib/tableStyles';

import { useGroupDetail } from '../hooks/useGroupDetail';
import { GroupDetailOverview } from './GroupDetailOverview';

export default function GroupGeneralInfo({
  groupId = null,
  onBack = null,
  onRemoveStudent = null,
  onAddStudent = null,
}) {
  const { info, loading } = useGroupDetail(groupId);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const { MODALS, ACTIONS } = GROUP_MANAGEMENT;
  const VIEW = MODALS.VIEW;

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
        <Spin size="large" description={GROUP_MANAGEMENT.MESSAGES.LOAD_ERROR} />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 min-h-[400px]">
        <Empty description={GROUP_MANAGEMENT.TABLE.EMPTY_TEXT} />
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
          {ACTIONS.BACK_TO_LIST}
        </Button>
      </div>

      <GroupDetailOverview info={info} VIEW={VIEW} GROUP_MANAGEMENT={GROUP_MANAGEMENT} />

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

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <DataTable
            columns={[
              {
                title: VIEW.TABLE.CODE,
                key: 'code',
                width: 120,
                render: (text) => <span className={TABLE_CELL.mono}>{text}</span>,
              },
              {
                title: VIEW.TABLE.FULL_NAME,
                key: 'fullName',
                render: (text) => <span className={TABLE_CELL.primary}>{text}</span>,
              },
              {
                title: VIEW.TABLE.EMAIL,
                key: 'email',
                render: (text) => (
                  <div className="flex max-w-[min(100%,320px)] items-center gap-1.5 truncate">
                    <MailOutlined className="shrink-0 text-[10px] text-slate-400" />
                    <span className={TABLE_CELL.secondary}>{text}</span>
                  </div>
                ),
              },
              {
                title: VIEW.TABLE.SCHOOL,
                key: 'universityName',
                render: (text) => (
                  <div className="flex max-w-[200px] items-center gap-1.5 truncate">
                    <BankOutlined className="shrink-0 text-[10px] text-slate-400" />
                    <span className={TABLE_CELL.secondary}>{text}</span>
                  </div>
                ),
              },
              {
                title: VIEW.TABLE.ACTION || 'ACTION',
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
                      <span className="text-[12px] text-slate-300">-</span>
                    )}
                  </div>
                ),
              },
            ]}
            data={filteredMembers}
            rowKey="id"
            size="small"
            minWidth="auto"
          />
        </div>
      </Card>
    </div>
  );
}
