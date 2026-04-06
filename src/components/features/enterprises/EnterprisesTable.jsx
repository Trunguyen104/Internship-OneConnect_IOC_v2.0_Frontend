'use client';

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { USER_STATUS, USER_STATUS_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

import EnterprisesAction from './EnterprisesAction';

export default function EnterprisesTable({ enterprises = [], loading = false }) {
  const columns = useMemo(
    () => [
      {
        title: UI_TEXT.ENTERPRISES.TAX_ID_SHORT,
        key: 'taxCode',
        width: '130px',
        render: (code) => (
          <span className="font-mono text-[12px] text-slate-400">
            {code || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.ENTERPRISES.ENTERPRISE,
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
        title: UI_TEXT.ENTERPRISES.INDUSTRY_COLUMN,
        key: 'industry',
        className: 'hidden lg:table-cell',
        render: (industry) => (
          <span className="text-[12px] font-medium text-primary">{industry || 'General'}</span>
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
        render: (_, record) => <EnterprisesAction enterprise={record} />,
      },
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <DataTable
        columns={columns}
        data={enterprises}
        loading={loading}
        rowKey={(record) => record.enterpriseId || record.id}
        emptyText={UI_TEXT.ENTERPRISES.NOT_FOUND}
        minWidth="auto"
      />
    </div>
  );
}

EnterprisesTable.propTypes = {
  enterprises: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};
