import SidebarAdmin from '@/shared/components/SidebarAdmin';

export default function Admin({ children }) {
  return (
    <div className='flex min-h-screen'>
      <SidebarAdmin />
      <main className='flex-1 p-6 bg-gray-100 overflow-x-hidden'>{children}</main>
    </div>
  );
}
