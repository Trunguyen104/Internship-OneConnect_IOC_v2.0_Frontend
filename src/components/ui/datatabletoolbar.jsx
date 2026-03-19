import React from 'react';
import { SearchOutlined, PlusCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

export default function DataTableToolbar({
  leftContent,
  searchProps,
  filterContent,
  actionProps,
  className = '',
}) {
  const renderActionButton = () => (
    <button
      onClick={!actionProps.menu ? actionProps.onClick : undefined}
      className={`bg-primary hover:bg-primary-hover ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition-all active:scale-95 ${actionProps.className || ''}`}
    >
      <span>{actionProps.label}</span>
      {actionProps.icon || <PlusCircleOutlined className='text-base' />}
      {actionProps.menu && <DownOutlined className='ml-1 text-[10px]' />}
    </button>
  );

  return (
    <div className={`flex w-full flex-wrap items-center gap-4 ${className}`}>
      {leftContent && <div className='flex min-w-0 shrink-0 items-center gap-4'>{leftContent}</div>}

      <div className='flex min-w-0 flex-1 flex-wrap items-center gap-3'>
        {searchProps && (
          <div
            className={`relative min-w-[200px] flex-1 sm:flex-initial ${searchProps.width || 'sm:w-72'}`}
          >
            <input
              value={searchProps.value}
              onChange={searchProps.onChange}
              placeholder={searchProps.placeholder || 'Search...'}
              className={`focus:border-primary focus:ring-primary/20 w-full rounded-full border border-transparent bg-slate-100 py-2 pr-10 pl-4 text-sm transition-all outline-none hover:bg-slate-200/50 focus:bg-white focus:ring-2 ${searchProps.className || ''}`}
            />
            <SearchOutlined className='absolute top-1/2 right-4 -translate-y-1/2 text-slate-400' />
          </div>
        )}

        {filterContent && <div className='flex shrink-0 items-center gap-2'>{filterContent}</div>}

        {actionProps &&
          (actionProps.menu ? (
            <Dropdown menu={actionProps.menu} trigger={['click']} placement='bottomRight'>
              {renderActionButton()}
            </Dropdown>
          ) : (
            renderActionButton()
          ))}
      </div>
    </div>
  );
}
