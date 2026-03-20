'use client';

import { FilterOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';

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
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="focus:border-primary focus:ring-primary/20 w-full rounded-full border border-slate-300 bg-white py-2 pr-10 pl-4 text-sm focus:ring-2"
        />
        <SearchOutlined className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" />
      </div>

      {showFilter && (
        <button
          onClick={onFilterClick}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <FilterOutlined />
          Filter
        </button>
      )}

      {showAction && (
        <button
          onClick={onActionClick}
          className="bg-primary hover:bg-primary-hover ml-auto flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white"
        >
          {actionLabel} <PlusCircleOutlined />
        </button>
      )}
    </div>
  );
}
