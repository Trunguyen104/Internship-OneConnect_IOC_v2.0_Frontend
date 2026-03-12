'use client';

import React from 'react';
import { App } from 'antd';
import { useGroupManagement } from '../../hooks/useGroupManagement';
import { GroupFilters } from './GroupFilters';
import { ViewGroupModal } from './ViewGroupModal';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupCard } from './GroupCard';
import { AssignMentorModal } from './AssignMentorModal';

function GroupManagementContent() {
  const {
    groups,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    filteredGroups,
    assignModal,
    setAssignModal,
    viewModal,
    setViewModal,
    createModal,
    setCreateModal,
    handleAssignSubmit,
    handleDeleteGroup,
    handleCreateGroup,
  } = useGroupManagement();

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col overflow-hidden bg-[#fcfafa] font-['Be_Vietnam_Pro'] text-slate-900">
      <div className='mx-auto flex w-full max-w-[1440px] flex-1 flex-col overflow-hidden px-10 pt-10'>
        <GroupFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
          onCreate={() => setCreateModal(true)}
          groupCount={groups.length}
        />

        <div className='premium-scrollbar flex-1 overflow-y-auto pb-10'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onAssign={(g) => setAssignModal({ open: true, group: g })}
                onDelete={handleDeleteGroup}
                onView={(g) => setViewModal({ open: true, group: g })}
              />
            ))}
          </div>
        </div>
      </div>

      <AssignMentorModal
        open={assignModal.open}
        group={assignModal.group}
        onCancel={() => setAssignModal({ open: false, group: null })}
        onFinish={handleAssignSubmit}
      />

      <ViewGroupModal
        open={viewModal.open}
        group={viewModal.group}
        onCancel={() => setViewModal({ open: false, group: null })}
      />

      <CreateGroupModal
        open={createModal}
        onCancel={() => setCreateModal(false)}
        onFinish={handleCreateGroup}
      />
    </div>
  );
}

export default function GroupManagement() {
  return (
    <App>
      <GroupManagementContent />
    </App>
  );
}
