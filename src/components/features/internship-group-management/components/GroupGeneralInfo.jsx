'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Empty, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useGroupDetail } from '../hooks/useGroupDetail';
import { GroupDetailOverview } from './GroupDetailOverview';
import { GroupMembersTable } from './GroupMembersTable';

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

      <GroupMembersTable
        members={filteredMembers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        info={info}
        onAddStudent={onAddStudent}
        onRemoveStudent={onRemoveStudent}
        groupId={groupId}
        VIEW={VIEW}
      />
    </div>
  );
}
