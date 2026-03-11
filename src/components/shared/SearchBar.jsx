'use client';

import { SearchOutlined, FilterOutlined, PlusCircleOutlined } from '@ant-design/icons';

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
    <div className='flex items-center gap-3 w-full'>
      <div className={`relative ${width}`}>
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className='w-full rounded-full border border-slate-300 bg-white py-2 pl-4 pr-10
            text-sm focus:border-primary focus:ring-2 focus:ring-primary/20'
        />
        <SearchOutlined className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400' />
      </div>

      {showFilter && (
        <button
          onClick={onFilterClick}
          className='flex items-center gap-2 rounded-full border border-slate-300
            px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 cursor-pointer'
        >
          <FilterOutlined />
          Filter
        </button>
      )}

      {showAction && (
        <button
          onClick={onActionClick}
          className='ml-auto flex items-center gap-2 rounded-full
            bg-primary px-5 py-2 text-sm font-medium text-white
            hover:bg-primary-hover cursor-pointer'
        >
          {actionLabel} <PlusCircleOutlined />
        </button>
      )}
    </div>
  );
}
