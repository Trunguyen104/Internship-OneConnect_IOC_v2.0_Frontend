'use client';

import { SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useState } from 'react';

import PageTitle from '@/components/ui/pagetitle';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import GroupManagement from '../../internship-group-management/components';
import InternshipManagement from '../../internship-student-management/components';

export default function InternshipManagementContainer() {
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const [activeTab, setActiveTab] = useState('students');

  const tabItems = [
    {
      key: 'students',
      label: (
        <span className="flex items-center gap-2">
          <SolutionOutlined />
          {GROUP_MANAGEMENT.TABS.STUDENTS}
        </span>
      ),
      children: <InternshipManagement />,
    },
    {
      key: 'groups',
      label: (
        <span className="flex items-center gap-2">
          <TeamOutlined />
          {GROUP_MANAGEMENT.TABS.GROUPS}
        </span>
      ),
      children: <GroupManagement />,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-full flex-1 flex-col">
      <PageTitle title={GROUP_MANAGEMENT.TITLE} showBack={false} />

      <div className="flex-1 px-4 sm:px-8">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="h-full [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-content-holder]:flex-1"
          destroyInactiveTabPane={false}
        />
      </div>
    </div>
  );
}
