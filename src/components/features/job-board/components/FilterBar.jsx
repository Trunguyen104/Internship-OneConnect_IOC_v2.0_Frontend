import { Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { JOB_BOARD_UI } from '@/constants/job-board/uiText';

const filterOptions = [
  { value: 'location', label: JOB_BOARD_UI.FILTER_LOCATION },
  { value: 'salary', label: JOB_BOARD_UI.FILTER_SALARY },
  { value: 'experience', label: JOB_BOARD_UI.FILTER_EXPERIENCE },
  { value: 'category', label: JOB_BOARD_UI.FILTER_CATEGORY },
];

export default function FilterBar() {
  return (
    <div className='flex items-center'>
      <div className='flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 transition hover:border-emerald-500'>
        <FilterOutlined className='text-sm text-slate-500' />

        <span className='text-sm whitespace-nowrap text-slate-500'>{JOB_BOARD_UI.FILTER_BY}</span>

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
