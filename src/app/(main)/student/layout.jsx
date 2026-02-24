import Header from '@/shared/components/Header';
import Sidebar from '@/shared/components/Sidebar';

export default function Space({ children }) {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <div className='flex flex-col flex-1 min-w-0'>
        <Header />
        <main className='flex-1 p-6 bg-gray-100 overflow-x-hidden'>{children}</main>
      </div>
    </div>
  );
}
