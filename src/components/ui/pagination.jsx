'use client';

import { Pagination as AntdPagination } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

export default function Pagination({
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) {
  return (
    <div className="flex items-center justify-end">
      <AntdPagination
        current={page}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={pageSizeOptions}
        onChange={(current, size) => {
          if (size !== pageSize) {
            onPageSizeChange?.(size);
            onPageChange?.(1); // Luôn về trang 1 khi đổi size
          } else {
            onPageChange?.(current);
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
