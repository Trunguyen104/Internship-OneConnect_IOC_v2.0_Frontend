import Header from '@/components/layout/Header';
import SidebarAdmin from '@/components/layout/SidebarAdmin';

export default function Admin({ children }) {
  return (
    <div className='flex h-screen overflow-hidden'>
      <SidebarAdmin />

      <div className='flex h-screen min-w-0 flex-1 flex-col overflow-hidden'>
        <Header />
        <main className='flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100 p-6 2xl:px-10'>
          <div className='mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
