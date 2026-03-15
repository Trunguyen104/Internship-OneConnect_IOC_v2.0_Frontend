'use client';

import { Input, Select, Button } from 'antd';
import { SearchOutlined, EnvironmentOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { JOB_BOARD_UI } from '@/constants/job-board';

const categoryOptions = [{ value: 'all', label: JOB_BOARD_UI.CHOOSE_CATEGORY }];
const locationOptions = [
  { value: 'all', label: JOB_BOARD_UI.CHOOSE_LOCATION },
  { value: 'hn', label: JOB_BOARD_UI.LOCATION_HN },
  { value: 'hcm', label: JOB_BOARD_UI.LOCATION_HCM },
];

export default function SearchBar() {
  return (
    <section className='bg-primary px-4 pt-12 pb-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6 flex w-full items-center rounded-full bg-white p-1.5 shadow-xl'>
          <div className='hidden max-w-[200px] flex-1 items-center px-3 lg:flex'>
            <UnorderedListOutlined className='mr-2 text-gray-400' />
            <Select
              variant='borderless'
              defaultValue='all'
              className='w-full font-medium'
              options={categoryOptions}
            />
          </div>

          <div className='hidden h-8 w-px bg-gray-200 lg:block' />

          <div className='flex-2 px-3'>
            <Input
              variant='borderless'
              placeholder={JOB_BOARD_UI.SEARCH_PLACEHOLDER}
              className='py-2.5 text-[15px]'
            />
          </div>

          <div className='h-8 w-px bg-gray-200' />

          <div className='flex min-w-[160px] flex-1 items-center px-3'>
            <EnvironmentOutlined className='mr-2 text-gray-400' />
            <Select
              variant='borderless'
              defaultValue='all'
              className='w-full font-medium'
              options={locationOptions}
            />
          </div>

          <Button
            type='primary'
            icon={<SearchOutlined />}
            className='bg-success hover:bg-success/80 h-[48px] rounded-full border-none px-10 font-bold'
          >
            {JOB_BOARD_UI.SEARCH_BUTTON}
          </Button>
        </div>
      </div>
    </section>
  );
}
