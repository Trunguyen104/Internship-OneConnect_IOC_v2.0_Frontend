'use client';

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import SkeletonTable from '@/components/ui/SkeletonTable';
import { cn } from '@/lib/cn';

import { Checkbox } from './checkbox';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyText = 'No data found',
  minWidth = '1000px',
  rowKey = 'id',
  onRowClick,
  className = '',
  sortBy,
  sortOrder,
  onSort,
  rowSelection,
  size = 'middle', // small, middle, large
}) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const headerPadding = isSmall ? 'py-3' : isLarge ? 'py-6' : 'py-5';
  const cellPadding = isSmall ? 'py-2' : isLarge ? 'py-5' : 'py-3.5';
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

    let nextSelectedRowKeys;
    if (checked) {
      nextSelectedRowKeys = Array.from(new Set([...selectedRowKeys, ...selectableKeys]));
    } else {
      nextSelectedRowKeys = selectedRowKeys.filter((key) => !selectableKeys.includes(key));
    }

    const nextSelectedRows = data.filter((record) =>
      nextSelectedRowKeys.includes(getRowKey(record))
    );
    onChange?.(nextSelectedRowKeys, nextSelectedRows);
  };

  const handleSelectRow = (record, checked) => {
    if (!rowSelection) return;
    const { onChange, selectedRowKeys = [] } = rowSelection;
    const key = getRowKey(record);

    let nextSelectedRowKeys;
    if (checked) {
      nextSelectedRowKeys = [...selectedRowKeys, key];
    } else {
      nextSelectedRowKeys = selectedRowKeys.filter((k) => k !== key);
    }

    const nextSelectedRows = data.filter((record) =>
      nextSelectedRowKeys.includes(getRowKey(record))
    );
    onChange?.(nextSelectedRowKeys, nextSelectedRows);
  };

  if (loading && (!Array.isArray(data) || data.length === 0)) {
    return (
      <div className="flex flex-1 flex-col py-6">
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
    <div className={`mt-5 flex min-h-0 flex-1 flex-col ${className}`}>
      <div className="flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse text-left" style={{ minWidth }}>
          <thead className="border-border bg-bg sticky top-0 z-10 border-b">
            <tr>
              {rowSelection && (
                <th
                  className={cn('w-[60px] cursor-pointer px-4 align-middle', headerPadding)}
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
                    className={`text-muted px-6 ${headerPadding} text-xs font-semibold tracking-wider uppercase whitespace-nowrap ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''} ${canSort ? 'cursor-pointer hover:text-primary transition-colors' : ''} `}
                  >
                    <div
                      className={`flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}
                    >
                      {col.title}
                      {canSort && (
                        <div className="flex flex-col text-[8px] leading-[4px]">
                          <ArrowUpOutlined
                            className={`${isSorted && sortOrder === 'Asc' ? 'text-primary' : 'text-muted/30'}`}
                          />
                          <ArrowDownOutlined
                            className={`${isSorted && sortOrder === 'Desc' ? 'text-primary' : 'text-muted/30'}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-border/50 divide-y">
            {data.filter(Boolean).map((record, index) => {
              const key = getRowKey(record, index);
              const isSelected = rowSelection?.selectedRowKeys?.includes(key);
              const { disabled = false } = rowSelection?.getCheckboxProps?.(record) || {};

              return (
                <tr
                  key={key}
                  onClick={() => !disabled && onRowClick?.(record)}
                  className={cn(
                    'group transition-all duration-200',
                    isSmall ? 'h-[48px]' : isLarge ? 'h-[80px]' : 'h-[64px]',
                    isSelected
                      ? 'bg-primary/5 border-l-2 border-l-primary shadow-sm'
                      : 'hover:bg-bg/80',
                    onRowClick && !disabled ? 'cursor-pointer' : ''
                  )}
                >
                  {rowSelection && (
                    <td
                      className={cn('w-[60px] cursor-pointer px-4 align-middle', cellPadding)}
                      onClick={(e) => {
                        e.stopPropagation();
                        const { disabled = false } = rowSelection?.getCheckboxProps?.(record) || {};
                        if (!disabled) {
                          handleSelectRow(record, !isSelected);
                        }
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
                      className={`px-6 ${cellPadding} align-middle text-sm transition-all ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''} `}
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
