'use client';

import { CloseCircleOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Space } from 'antd';
import React, { useState } from 'react';

import Button from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';

import { PLACEMENT_STATUS, SEMESTER_STATUS } from '../constants/placement.constants';
import { PlacementService } from '../services/placement.service';
import { BulkAssignModal, BulkReassignModal, BulkUnassignModal } from './BulkPlacementModals';
import PlacementStatusBadge from './PlacementStatusBadge';
import StudentRowActions from './StudentRowActions';

/**
 * Main table for Student Internship Semester.
 * AC-09: Displays columns and provides row/bulk actions.
 */
const StudentInternshipTable = ({ semesterId, semesterStatus = SEMESTER_STATUS.ACTIVE }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalType, setModalType] = useState(null); // 'assign', 'reassign', 'unassign'
  const UI = PLACEMENT_UI_TEXT.TABLE;

  const { data: res, isLoading } = useQuery({
    queryKey: ['semester-students', semesterId],
    queryFn: () => PlacementService.getSemesterStudents(semesterId),
    enabled: !!semesterId,
  });

  const students = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // AC-08/09: Disable actions if semester is over
  const isEnded =
    semesterStatus === SEMESTER_STATUS.ENDED || semesterStatus === SEMESTER_STATUS.CLOSED;

  const columns = [
    {
      title: UI.FULL_NAME,
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{text}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {record.studentCode || record.studentId}
          </span>
        </div>
      ),
    },
    {
      title: UI.EMAIL,
      dataIndex: 'email',
      key: 'email',
      className: 'text-xs text-slate-500',
    },
    {
      title: UI.MAJOR,
      dataIndex: 'major',
      key: 'major',
      className: 'text-xs',
    },
    {
      title: UI.ENTERPRISE,
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      render: (text) =>
        text ? (
          <span className="text-xs font-medium text-slate-600">{text}</span>
        ) : (
          <span className="text-xs text-slate-300 italic">{UI.UNASSIGNED}</span>
        ),
    },
    {
      title: UI.STATUS,
      dataIndex: 'placementStatus',
      key: 'placementStatus',
      width: 160,
      render: (status) => <PlacementStatusBadge status={status} />,
    },
    {
      title: UI.LOGBOOK,
      key: 'logbook',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <span className="text-xs font-mono text-slate-400">
          {record.placementStatus === PLACEMENT_STATUS.PLACED ? ' Suff. ' : ' — '}
        </span>
      ),
    },
    {
      title: UI.ACTION,
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <StudentRowActions
          student={record}
          semesterId={semesterId}
          semesterStatus={semesterStatus}
          onUnassign={(student) => {
            setSelectedRows([student]);
            setModalType('unassign');
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* AC-02, AC-03, AC-04: Bulk Action Bar */}
      <div
        className={`transition-all duration-300 ${
          selectedRowKeys.length >= 2 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl shadow-sm shadow-primary/5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold ring-4 ring-primary/10">
              {selectedRowKeys.length}
            </span>
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              {UI.STUDENTS_SELECTED}
            </span>
          </div>

          <Space size="middle">
            <Button
              variant="info"
              size="sm"
              icon={<UserAddOutlined className="text-xs" />}
              onClick={() => setModalType('assign')}
              className="flex items-center gap-1.5"
              disabled={isEnded}
            >
              {UI.ACTION_ASSIGN}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<SwapOutlined className="text-xs" />}
              onClick={() => setModalType('reassign')}
              className="flex items-center gap-1.5"
              disabled={isEnded}
            >
              {UI.ACTION_CHANGE}
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<CloseCircleOutlined className="text-xs" />}
              onClick={() => setModalType('unassign')}
              className="flex items-center gap-1.5"
              disabled={isEnded}
            >
              {UI.ACTION_CANCEL}
            </Button>
          </Space>
        </div>
      </div>

      <DataTable
        columns={columns}
        dataSource={students}
        loading={isLoading}
        rowSelection={rowSelection}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 12, size: 'small' }}
        className="placement-table-wrapper"
      />

      {/* Modals */}
      <BulkAssignModal
        visible={modalType === 'assign'}
        onClose={() => setModalType(null)}
        selectedStudents={selectedRows}
        semesterId={semesterId}
      />
      <BulkReassignModal
        visible={modalType === 'reassign'}
        onClose={() => setModalType(null)}
        selectedStudents={selectedRows}
        semesterId={semesterId}
      />
      <BulkUnassignModal
        visible={modalType === 'unassign'}
        onClose={() => setModalType(null)}
        selectedStudents={selectedRows}
        semesterId={semesterId}
      />
    </div>
  );
};

export default StudentInternshipTable;
