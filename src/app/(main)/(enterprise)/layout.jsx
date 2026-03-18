import EnterpriseSidebar from '@/components/layout/EnterpriseSidebar';

export default function EnterpriseLayout({ children }) {
  return (
    <div className='flex h-screen overflow-hidden bg-white'>
      <EnterpriseSidebar />
      <div className='flex h-screen min-w-0 flex-1 flex-col overflow-hidden'>
        <main className='flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-6 2xl:px-10'>
          <div className='mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
