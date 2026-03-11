import React from 'react';
import { Search, Filter } from 'lucide-react';

export const BoardHeader = () => {
  return (
    <div className='flex items-center gap-4 mb-6 sticky top-0 bg-slate-50 pt-1 z-10'>
      <div className='flex items-center w-[360px] h-10 px-4 rounded-full border border-gray-200 bg-white shadow-sm'>
        <Search className='w-4 h-4 text-gray-400 mr-2 shrink-0' />
        <input
          type='text'
          placeholder='Tìm kiếm'
          className='flex-1 outline-none text-sm bg-transparent placeholder-gray-400 text-gray-800'
        />
      </div>
      <button className='flex items-center gap-2 h-10 px-5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700'>
        <Filter className='w-4 h-4 text-gray-500' />
        Bộ lọc
      </button>
    </div>
  );
};
