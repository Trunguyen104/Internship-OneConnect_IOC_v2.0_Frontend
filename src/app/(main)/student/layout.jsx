import Header from '@/shared/components/Header';
import Sidebar from '@/shared/components/Sidebar';

export default function Dashboards({ children }) {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <div className='flex flex-col flex-1'>
        <Header />
        <main className='flex-1 p-6 bg-gray-50'>{children}</main>
      </div>
    </div>
  );
}
