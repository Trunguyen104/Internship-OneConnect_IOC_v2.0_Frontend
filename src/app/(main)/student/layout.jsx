import Header from '@/shared/components/Header';
import Sidebar from '@/shared/components/Sidebar';

export default function Dashboards({ children }) {
  return (
    <div className='flex h-screen'>
      <Sidebar />

      <div className='flex flex-col flex-1 overflow-hidden'>
        <Header />
        <main className='flex-1 p-6 bg-gray-100 overflow-hidden'>{children}</main>
      </div>
    </div>
  );
}
