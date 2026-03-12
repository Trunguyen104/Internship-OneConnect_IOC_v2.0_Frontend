import Header from '@/components/layout/Header';
import SidebarAdmin from '@/components/layout/SidebarAdmin';

export default function Admin({ children }) {
  return (
    <div className='flex min-h-screen'>
      <SidebarAdmin />

      <div className='flex min-w-0 flex-1 flex-col'>
        <Header />
        <main className='flex-1 overflow-x-hidden bg-gray-100 p-6'>{children}</main>
      </div>
    </div>
  );
}
