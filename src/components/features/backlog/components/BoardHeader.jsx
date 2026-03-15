import React from 'react';
import { Search, Filter } from 'lucide-react';
import { BACKLOG_UI } from '@/constants/backlog';

export const BoardHeader = () => {
  return (
    <div className='bg-bg sticky top-0 z-10 mb-6 flex items-center gap-4 pt-1'>
      <div className='flex h-10 w-[360px] items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm'>
        <Search className='mr-2 h-4 w-4 shrink-0 text-gray-400' />
        <input
          type='text'
          placeholder={BACKLOG_UI.SEARCH_PLACEHOLDER}
          className='flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none'
        />
      </div>
      <button className='flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50'>
        <Filter className='h-4 w-4 text-gray-500' />
        {BACKLOG_UI.FILTER}
      </button>
    </div>
  );
};
