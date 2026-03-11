'use client';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, EnvironmentOutlined, UnorderedListOutlined } from '@ant-design/icons';

const categoryOptions = [{ value: 'all', label: 'Danh mục Nghề' }];
const locationOptions = [
  { value: 'all', label: 'Địa điểm' },
  { value: 'hn', label: 'Hà Nội' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
];

export default function SearchBar() {
  return (
    <section className='bg-[#004d3d] pt-12 pb-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white p-1.5 rounded-full flex items-center shadow-xl w-full mb-6'>
          <div className='hidden lg:flex items-center flex-1 max-w-[200px] px-3'>
            <UnorderedListOutlined className='text-gray-400 mr-2' />
            <Select
              variant='borderless'
              defaultValue='all'
              className='w-full font-medium'
              options={categoryOptions}
            />
          </div>

          <div className='hidden lg:block h-8 w-px bg-gray-200' />

          <div className='flex-[2] px-3'>
            <Input
              variant='borderless'
              placeholder='Vị trí tuyển dụng, tên công ty'
              className='py-2.5 text-[15px]'
            />
          </div>

          <div className='h-8 w-px bg-gray-200' />

          <div className='flex items-center flex-1 min-w-[160px] px-3'>
            <EnvironmentOutlined className='text-gray-400 mr-2' />
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
            className='bg-[#00b14f] hover:bg-[#009a44] border-none rounded-full h-[48px] px-10 font-bold'
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </section>
  );
}

