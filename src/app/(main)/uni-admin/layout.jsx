import SidebarAdmin from '@/components/layout/SidebarAdmin';

export default function Admin({ children }) {
  return (
    <div className='flex min-h-screen'>
      <SidebarAdmin />
      <main className='flex-1 overflow-x-hidden bg-gray-100 p-6'>{children}</main>
    </div>
  );
}

