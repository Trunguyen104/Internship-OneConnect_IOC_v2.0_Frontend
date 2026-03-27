'use client';

import { Pagination as AntdPagination } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

export default function Pagination({
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-muted text-sm font-medium">
        {UI_TEXT.PAGINATION.TOTAL} <span className="text-text font-bold">{total}</span>
      </div>
      <AntdPagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={(p, ps) => {
          onPageChange?.(p);
          if (ps !== pageSize) {
            onPageSizeChange?.(ps);
          }
        }}
        showSizeChanger
        size="small"
        className="premium-pagination"
      />
    </div>
  );
}

Pagination.propTypes = {
  total: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};
