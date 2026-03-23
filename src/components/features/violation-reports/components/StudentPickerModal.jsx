'use client';

import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const StudentPickerModal = ({ visible, onCancel, onSelect, students = [], loading = false }) => {
  const [search, setSearch] = useState('');
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;

  // useEffect(() => {
  //   if (visible) {
  //     setSearch('');
  //   }
  // }, [visible]);
  const handleCancel = () => {
    setSearch('');
    onCancel();
  };
  const filteredStudents = useMemo(() => {
    if (!search) return students;
    const lowerSearch = search.toLowerCase();
    return students.filter(
      (s) =>
        s.studentFullName?.toLowerCase().includes(lowerSearch) ||
        s.studentCode?.toLowerCase().includes(lowerSearch)
    );
  }, [students, search]);

  const columns = [
    {
      title: VIOLATION_REPORT.TABLE.COLUMNS.STUDENT_NAME,
      key: 'studentFullName',
      width: '60%',
    },
    {
      title: VIOLATION_REPORT.TABLE.COLUMNS.STUDENT_CODE,
      key: 'studentCode',
      width: '40%',
    },
  ];

  return (
    <CompoundModal open={visible} onCancel={handleCancel} width={600} destroyOnClose>
      <CompoundModal.Header title={VIOLATION_REPORT.FORM.STUDENT} />
      <CompoundModal.Content className="!pb-0">
        <DataTableToolbar
          searchProps={{
            placeholder: VIOLATION_REPORT.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          className="mb-4"
        />
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
      <CompoundModal.Footer onCancel={onCancel} hideConfirm />
    </CompoundModal>
  );
};

export default StudentPickerModal;
