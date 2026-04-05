'use client';

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { USER_STATUS, USER_STATUS_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

import UniversitiesAction from './UniversitiesAction';

export default function UniversitiesTable({ universities = [], loading = false }) {
  const columns = useMemo(
    () => [
      {
        title: UI_TEXT.USER_MANAGEMENT.CODE,
        key: 'code',
        width: '130px',
        render: (code) => (
          <span className="font-mono text-[12px] text-slate-400">
            {code || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.UNIVERSITIES.UNIVERSITY,
        key: 'name',
        render: (name) => (
          <span className="text-[13px] font-semibold text-slate-800">
            {name || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.EMAIL_ADDRESS,
        key: 'contactEmail',
        render: (email, record) => (
          <span className="text-[12px] text-slate-500 font-medium">
            {email ||
              record.contactEmail ||
              record.contact_email ||
              record.Email ||
              UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.UNIVERSITIES.ADDRESS,
        key: 'address',
        className: 'hidden lg:table-cell',
        render: (address) => (
          <span className="line-clamp-1 text-[13px] text-slate-500">
            {address || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.STATUS,
        key: 'status',
        width: '120px',
        render: (status) => {
          const active = status === USER_STATUS.ACTIVE;
          return (
            <span
              className={`text-[12px] font-semibold ${active ? 'text-emerald-600' : 'text-red-500'}`}
            >
              {USER_STATUS_LABEL[status] || status || UI_TEXT.COMMON.MINUS}
            </span>
          );
        },
      },
      {
        title: '',
        key: 'action',
        align: 'right',
        width: '48px',
        render: (_, record) => <UniversitiesAction university={record} />,
      },
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <DataTable
        columns={columns}
        data={universities}
        loading={loading}
        rowKey={(record) => record.universityId}
        emptyText={UI_TEXT.UNIVERSITIES.NOT_FOUND}
        minWidth="auto"
      />
    </div>
  );
}

UniversitiesTable.propTypes = {
  universities: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};
