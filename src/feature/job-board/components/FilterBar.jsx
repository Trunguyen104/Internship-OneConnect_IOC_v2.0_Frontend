'use client';

import { Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const filterOptions = [
  { value: 'location', label: 'Địa điểm' },
  { value: 'salary', label: 'Mức lương' },
  { value: 'experience', label: 'Kinh nghiệm' },
  { value: 'category', label: 'Ngành nghề' },
];

export default function FilterBar() {
  return (
    <div className='flex items-center'>
      <div className='flex items-center gap-2 h-10 px-4 rounded-full border border-slate-300 bg-white hover:border-emerald-500 transition'>
        <FilterOutlined className='text-slate-500 text-sm' />

        <span className='text-sm text-slate-500 whitespace-nowrap'>Lọc theo:</span>

        <Select
          variant='borderless'
          defaultValue='location'
          options={filterOptions}
          className='min-w-35'
        />
      </div>
    </div>
  );
}
