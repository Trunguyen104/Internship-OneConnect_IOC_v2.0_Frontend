'use client';

import React from 'react';
import { App } from 'antd';
import Card from '@/components/ui/Card';
import { useGroupManagement } from './hooks/useGroupManagement';
import { GroupHeader } from './components/GroupHeader';
import { GroupFilters } from './components/GroupFilters';
import { GroupCard } from './components/GroupCard';
import { CreateGroupModal } from './components/CreateGroupModal';
import { ViewGroupModal } from './components/ViewGroupModal';
import { AssignMentorModal } from './components/AssignMentorModal';

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
    <>
      <GroupHeader onCreate={() => setCreateModal(true)} />
      <div className='mx-auto flex w-full max-w-[1440px] flex-1 flex-col'>
        <Card>
          <GroupFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            search={search}
            onSearchChange={setSearch}
            groupCount={groups.length}
          />
          <div className='premium-scrollbar flex-1 overflow-y-auto pb-4'>
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
        </Card>
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
    </>
  );
}

export default function GroupManagement() {
  return (
    <App>
      <GroupManagementContent />
    </App>
  );
}
