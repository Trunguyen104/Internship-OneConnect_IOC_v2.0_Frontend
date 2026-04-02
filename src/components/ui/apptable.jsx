'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { mapAntdColumnsToDataTable } from '@/lib/mapAntdTableColumns';

/**
 * Thin adapter: Ant Design column shape → shared DataTable (admin UI).
 * Prefer importing DataTable directly for new code; AppTable exists for legacy antd column objects.
 */
export default function AppTable({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  emptyText = 'No data',
  minWidth = '800px',
  className = '',
}) {
  const mappedColumns = useMemo(() => mapAntdColumnsToDataTable(columns), [columns]);

  return (
    <DataTable
      columns={mappedColumns}
      data={data}
      loading={loading}
      emptyText={emptyText}
      minWidth={minWidth}
      rowKey={rowKey}
      className={className}
    />
  );
}

AppTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  emptyText: PropTypes.node,
  minWidth: PropTypes.string,
  className: PropTypes.string,
};
