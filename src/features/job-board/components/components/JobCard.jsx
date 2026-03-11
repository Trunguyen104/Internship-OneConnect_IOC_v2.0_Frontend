'use client';
import { Card, Typography, Tag } from 'antd';
import { HeartOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function JobCard({ title, company, salary, location }) {
  return (
    <Card
      hoverable
      className='border-none rounded-xl shadow-sm hover:shadow-md transition'
      bodyStyle={{ padding: 16 }}
    >
      <div className='flex gap-4 h-full'>
        {/* LOGO */}
        <div className='w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-300 text-[10px] shrink-0'>
          LOGO
        </div>

        {/* CONTENT */}
        <div className='flex-1 min-w-0 flex flex-col justify-between'>
          <div>
            <div className='flex justify-between items-start gap-2'>
              <Text strong className='text-[15px] line-clamp-2 hover:text-[#00b14f] cursor-pointer'>
                {title || 'Nhân Viên Kinh Doanh'}
              </Text>

              <HeartOutlined className='text-gray-400 hover:text-red-500 cursor-pointer' />
            </div>

            <Text className='text-gray-400 text-[12px] block truncate uppercase mb-2'>
              {company || 'CÔNG TY TNHH ABC'}
            </Text>
          </div>

          <div className='flex items-center gap-2 mt-2'>
            <Tag className='m-0 border-none bg-[#e6f7ef] text-[#00b14f] font-medium'>
              {salary || '10 - 20 triệu'}
            </Tag>

            <Text type='secondary' className='text-[12px] flex items-center'>
              <EnvironmentOutlined className='mr-1' />
              {location || 'Hồ Chí Minh'}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

