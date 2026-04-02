'use client';

import { FilterOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UI_TEXT } from '@/lib/UI_Text';

export default function SearchBar({
  placeholder = 'Search',
  value,
  onChange,
  width = 'w-72',

  showFilter = false,
  onFilterClick,

  showAction = false,
  actionLabel,
  onActionClick,
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className={`relative ${width}`}>
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          suffix={<SearchOutlined className="text-slate-400" />}
          className="h-10 rounded-full border border-slate-300 px-4"
        />
      </div>

      {showFilter && (
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="flex h-10 items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 shadow-none hover:bg-slate-100"
        >
          <FilterOutlined />
          {UI_TEXT.COMMON.FILTER}
        </Button>
      )}

      {showAction && (
        <Button
          onClick={onActionClick}
          className="bg-primary hover:bg-primary-hover ml-auto flex h-10 items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white shadow-none"
        >
          {actionLabel} <PlusCircleOutlined />
        </Button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.string,
  showFilter: PropTypes.bool,
  onFilterClick: PropTypes.func,
  showAction: PropTypes.bool,
  actionLabel: PropTypes.node,
  onActionClick: PropTypes.func,
};
