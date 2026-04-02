'use client';

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import SkeletonTable from '@/components/ui/SkeletonTable';

import { Checkbox } from './checkbox';

/**
 * DataTable - Flat, compact data table following a lightweight admin UI pattern.
 * Rows are ~48px, no card wrapper, clean dividers, minimal visual noise.
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyText = 'No data found',
  minWidth = '800px',
  rowKey = 'id',
  onRowClick,
  className = '',
  sortBy,
  sortOrder,
  onSort,
  rowSelection,
  size = 'middle',
}) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const headerPx = 'px-4';
  const cellPx = 'px-4';
  const headerPy = isSmall ? 'py-2' : isLarge ? 'py-4' : 'py-3';
  const cellPy = isSmall ? 'py-2' : isLarge ? 'py-3.5' : 'py-3';

  const handleSort = (columnKey) => {
    if (!onSort || !columnKey) return;
    if (sortBy === columnKey) {
      onSort(columnKey, sortOrder === 'Asc' ? 'Desc' : 'Asc');
    } else {
      onSort(columnKey, 'Asc');
    }
  };

  const getRowKey = useCallback(
    (record, index) => {
      if (typeof rowKey === 'function') return rowKey(record, index);
      return record?.[rowKey] || record?.id || record?.key || index;
    },
    [rowKey]
  );

  const isAllSelected = useMemo(() => {
    if (!rowSelection || !data.length) return false;
    const { selectedRowKeys = [], getCheckboxProps } = rowSelection;
    const selectableData = getCheckboxProps
      ? data.filter((record) => !getCheckboxProps(record).disabled)
      : data;
    if (selectableData.length === 0) return false;
    return selectableData.every((record) => selectedRowKeys.includes(getRowKey(record)));
  }, [rowSelection, data, getRowKey]);

  const isIndeterminate = useMemo(() => {
    if (!rowSelection || !data.length || isAllSelected) return false;
    const { selectedRowKeys = [] } = rowSelection;
    return data.some((record) => selectedRowKeys.includes(getRowKey(record)));
  }, [rowSelection, data, getRowKey, isAllSelected]);

  const handleSelectAll = (checked) => {
    if (!rowSelection) return;
    const { onChange, getCheckboxProps, selectedRowKeys = [] } = rowSelection;
    const selectableData = getCheckboxProps
      ? data.filter((record) => !getCheckboxProps(record).disabled)
      : data;
    const selectableKeys = selectableData.map((record) => getRowKey(record));
    const nextSelectedRowKeys = checked
      ? Array.from(new Set([...selectedRowKeys, ...selectableKeys]))
      : selectedRowKeys.filter((key) => !selectableKeys.includes(key));
    const nextSelectedRows = data.filter((record) =>
      nextSelectedRowKeys.includes(getRowKey(record))
    );
    onChange?.(nextSelectedRowKeys, nextSelectedRows);
  };

  const handleSelectRow = (record, checked) => {
    if (!rowSelection) return;
    const { onChange, selectedRowKeys = [] } = rowSelection;
    const key = getRowKey(record);
    const nextSelectedRowKeys = checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter((k) => k !== key);
    const nextSelectedRows = data.filter((record) =>
      nextSelectedRowKeys.includes(getRowKey(record))
    );
    onChange?.(nextSelectedRowKeys, nextSelectedRows);
  };

  if (loading && (!Array.isArray(data) || data.length === 0)) {
    return (
      <div className="flex flex-1 flex-col">
        <SkeletonTable rows={10} columns={columns.length + (rowSelection ? 1 : 0) || 4} />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Empty description={<span className="text-muted font-medium">{emptyText}</span>} />
      </div>
    );
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}>
      <div className="flex-1 overflow-auto scrollbar-none">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          {/* ── Header ── */}
          <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <tr>
              {rowSelection && (
                <th
                  className={`w-10 cursor-pointer ${headerPx} ${headerPy} align-middle`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAll(!isAllSelected);
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onCheckedChange={(checked) => handleSelectAll(checked)}
                    />
                  </div>
                </th>
              )}
              {columns.map((col, index) => {
                const isSorted = sortBy === col.sortKey;
                const canSort = !!onSort && !!col.sortKey && col.sorter !== false;
                return (
                  <th
                    key={col.key || col.title || index}
                    style={{ width: col.width }}
                    onClick={() => canSort && handleSort(col.sortKey)}
                    className={[
                      'text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap',
                      `${headerPx} ${headerPy}`,
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                          ? 'text-right'
                          : 'text-left',
                      col.className || '',
                      canSort ? 'cursor-pointer hover:text-primary transition-colors' : '',
                    ].join(' ')}
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                      }`}
                    >
                      {col.title}
                      {canSort && (
                        <div className="flex flex-col text-[8px] leading-[4px] opacity-50">
                          <ArrowUpOutlined
                            className={
                              isSorted && sortOrder === 'Asc' ? 'text-primary opacity-100' : ''
                            }
                          />
                          <ArrowDownOutlined
                            className={
                              isSorted && sortOrder === 'Desc' ? 'text-primary opacity-100' : ''
                            }
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {data.filter(Boolean).map((record, index) => {
              const key = getRowKey(record, index);
              const isSelected = rowSelection?.selectedRowKeys?.includes(key);
              const { disabled = false } = rowSelection?.getCheckboxProps?.(record) || {};

              return (
                <tr
                  key={key}
                  onClick={() => !disabled && onRowClick?.(record)}
                  className={[
                    'border-b border-gray-50 transition-colors duration-150',
                    isSelected ? 'bg-primary/[0.04]' : 'hover:bg-slate-50/70',
                    onRowClick && !disabled ? 'cursor-pointer' : '',
                  ].join(' ')}
                >
                  {rowSelection && (
                    <td
                      className={`w-10 cursor-pointer ${cellPx} ${cellPy} align-middle`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) handleSelectRow(record, !isSelected);
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled}
                          onCheckedChange={(checked) => handleSelectRow(record, checked)}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || col.title || colIndex}
                      className={[
                        `${cellPx} ${cellPy} align-middle`,
                        'text-[13px] text-slate-800',
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                            ? 'text-right'
                            : 'text-left',
                        col.className || '',
                      ].join(' ')}
                    >
                      {col.render ? col.render(record[col.key], record, index) : record[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      key: PropTypes.string,
      sortKey: PropTypes.string,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      align: PropTypes.oneOf(['left', 'center', 'right']),
      className: PropTypes.string,
      render: PropTypes.func,
      sorter: PropTypes.bool,
    })
  ),
  data: PropTypes.array,
  loading: PropTypes.bool,
  emptyText: PropTypes.node,
  minWidth: PropTypes.string,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.oneOf(['Asc', 'Desc']),
  onSort: PropTypes.func,
  rowSelection: PropTypes.shape({
    selectedRowKeys: PropTypes.array,
    onChange: PropTypes.func,
    getCheckboxProps: PropTypes.func,
  }),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
};
