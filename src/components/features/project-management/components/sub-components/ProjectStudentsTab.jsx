'use client';

import { ArrowRightOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Input, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import React from 'react';

export default function ProjectStudentsTab({
  loading,
  searchTerm,
  setSearchTerm,
  assignedStudents,
  filteredStudents,
  DETAIL,
  currentProject,
  isHR,
}) {
  const studentColumns = [
    {
      title: DETAIL.STUDENTS?.COLUMNS?.NAME || 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div className="font-semibold text-sm">{text}</div>
            <div className="text-[11px] text-gray-400">{record.studentCode}</div>
          </div>
        </Space>
      ),
    },
    {
      title: DETAIL.STUDENTS?.COLUMNS?.UNIVERSITY || 'University',
      dataIndex: 'universityName',
      key: 'universityName',
      render: (text, record) =>
        record.universityName || record.university || record.schoolName || record.school || '-',
      responsive: ['md'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
    },
    {
      title: DETAIL.STUDENTS?.COLUMNS?.STATUS || 'Status',
      dataIndex: 'termStatus',
      key: 'termStatus',
      render: (status) => {
        let color = 'blue';
        if (status === 'Ended') color = 'default';
        if (status === 'Active') color = 'success';
        return (
          <Tag color={color} className="rounded-md font-medium text-[10px] px-2">
            {status || 'Active'}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="pt-2">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Input
            placeholder={DETAIL.STUDENTS?.SEARCH_PLACEHOLDER}
            prefix={<SearchOutlined className="text-slate-400" />}
            className="w-64 rounded-xl bg-slate-50 border-slate-100 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isHR && (currentProject?.internshipId || currentProject?.groupInfo?.internshipId) && (
            <Link
              href={`/internship-groups/${currentProject?.groupInfo?.internshipId || currentProject?.internshipId}`}
              className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary-hover bg-primary/5 px-3 py-2 rounded-lg transition-all uppercase tracking-wide border border-primary/10 shadow-sm"
            >
              <ArrowRightOutlined className="rotate-180" /> {DETAIL.GROUP?.MANAGE_LINK}
            </Link>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200/50 shadow-sm">
          {DETAIL.STUDENTS?.COUNT_LABEL} {assignedStudents.length} {DETAIL.GROUP?.STUDENTS_SUFFIX}
        </span>
      </div>
      <Table
        columns={studentColumns}
        dataSource={filteredStudents}
        loading={loading}
        rowKey="studentId"
        size="small"
        pagination={{ pageSize: 8 }}
        className="custom-table"
        locale={{
          emptyText: (
            <div className="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 mt-2">
              <p className="text-slate-400 italic mb-1 text-sm font-medium">
                {DETAIL.STUDENTS?.EMPTY_MESSAGE}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                {DETAIL.STUDENTS?.EMPTY_HINT}
              </p>
            </div>
          ),
        }}
      />
    </div>
  );
}
