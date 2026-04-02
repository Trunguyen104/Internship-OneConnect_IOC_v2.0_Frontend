'use client';

import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const StudentPickerModal = ({ visible, onCancel, onSelect, students = [], loading = false }) => {
  const [search, setSearch] = useState('');
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;

  const handleCancel = () => {
    setSearch('');
    onCancel();
  };

  const filteredStudents = useMemo(() => {
    // Sort students by groupName first, then by fullName
    const sorted = [...students].sort((a, b) => {
      const groupA = a.groupName || '';
      const groupB = b.groupName || '';
      if (groupA !== groupB) return groupA.localeCompare(groupB);
      return (a.studentFullName || a.fullName || '').localeCompare(
        b.studentFullName || b.fullName || ''
      );
    });

    if (!search) return sorted;
    const lowerSearch = search.toLowerCase();
    return sorted.filter(
      (s) =>
        s.studentFullName?.toLowerCase().includes(lowerSearch) ||
        s.fullName?.toLowerCase().includes(lowerSearch) ||
        s.studentCode?.toLowerCase().includes(lowerSearch) ||
        s.groupName?.toLowerCase().includes(lowerSearch)
    );
  }, [students, search]);

  const columns = [
    {
      title: VIOLATION_REPORT.TABLE.COLUMNS.STUDENT_NAME,
      key: 'studentFullName',
      width: '40%',
      render: (_, record) => record.studentFullName || record.fullName,
    },
    {
      title: VIOLATION_REPORT.TABLE.COLUMNS.STUDENT_CODE,
      key: 'studentCode',
      width: '25%',
      render: (_, record) => record.studentCode || record.userCode,
    },
    {
      title: VIOLATION_REPORT.DETAIL.INTERN_GROUP,
      key: 'groupName',
      width: '35%',
      render: (_, record) => record.groupName || VIOLATION_REPORT.COMMON.EMPTY_VALUE,
    },
  ];

  return (
    <CompoundModal
      open={visible}
      onCancel={handleCancel}
      width={600}
      destroyOnClose
      closable={false}
    >
      <CompoundModal.Header title={VIOLATION_REPORT.FORM.STUDENT} />
      <CompoundModal.Content className="!pb-0">
        <DataTableToolbar className="mb-4 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={VIOLATION_REPORT.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </DataTableToolbar>
        <div className="min-h-[400px]">
          <DataTable
            columns={columns}
            data={filteredStudents}
            loading={loading}
            minWidth="0"
            rowKey="id"
            onRowClick={onSelect}
          />
        </div>
      </CompoundModal.Content>
      <CompoundModal.Footer onCancel={onCancel} showConfirm={false} />
    </CompoundModal>
  );
};

export default StudentPickerModal;
