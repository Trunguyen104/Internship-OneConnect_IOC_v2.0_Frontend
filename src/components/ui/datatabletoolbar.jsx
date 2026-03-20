import React from 'react';
import { SearchOutlined, PlusCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

const Search = ({ value, onChange, placeholder, width, className = '' }) => (
  <div className={`relative min-w-[200px] flex-1 sm:flex-initial ${width || 'sm:w-72'}`}>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder || 'Search...'}
      className={`focus:border-primary focus:ring-primary/20 w-full rounded-full border border-transparent bg-slate-100 py-2 pr-10 pl-4 text-sm transition-all outline-none hover:bg-slate-200/50 focus:bg-white focus:ring-2 ${className}`}
    />
    <SearchOutlined className='absolute top-1/2 right-4 -translate-y-1/2 text-slate-400' />
  </div>
);

const Filters = ({ children, className = '' }) => (
  <div className={`flex shrink-0 items-center gap-2 ${className}`}>{children}</div>
);

const Actions = ({ label, onClick, icon, menu, className = '' }) => {
  const renderButton = () => (
    <button
      onClick={!menu ? onClick : undefined}
      className={`bg-primary hover:bg-primary-hover ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition-all active:scale-95 ${className}`}
    >
      <span>{label}</span>
      {icon || <PlusCircleOutlined className='text-base' />}
      {menu && <DownOutlined className='ml-1 text-[10px]' />}
    </button>
  );

  return menu ? (
    <Dropdown menu={menu} trigger={['click']} placement='bottomRight'>
      {renderButton()}
    </Dropdown>
  ) : (
    renderButton()
  );
};

export default function DataTableToolbar({
  children,
  leftContent,
  searchProps,
  filterContent,
  actionProps,
  className = '',
}) {
  // Backward compatibility: If no children, render the old way
  if (!children) {
    return (
      <div className={`flex w-full flex-wrap items-center gap-4 ${className}`}>
        {leftContent && (
          <div className='flex min-w-0 shrink-0 items-center gap-4'>{leftContent}</div>
        )}
        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-3'>
          {searchProps && <Search {...searchProps} />}
          {filterContent && <Filters>{filterContent}</Filters>}
          {actionProps && <Actions {...actionProps} />}
        </div>
      </div>
    );
  }

  return <div className={`flex w-full flex-wrap items-center gap-4 ${className}`}>{children}</div>;
}

// Attach sub-components
DataTableToolbar.Search = Search;
DataTableToolbar.Filters = Filters;
DataTableToolbar.Actions = Actions;
