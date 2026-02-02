import { BellOutlined, UserOutlined } from '@ant-design/icons';

export default function Header() {
  return (
    <header className='h-16 bg-gray-50 border-b border-slate-200 px-6 flex items-center justify-end'>
      <div className='flex items-center gap-4'>
        {/* Notification */}
        <button className='relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition'>
          <BellOutlined className='text-lg' />
          <span className='absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full'></span>
        </button>

        {/* Avatar */}
        <div className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition'>
          <UserOutlined className='text-lg' />
        </div>
      </div>
    </header>
  );
}
